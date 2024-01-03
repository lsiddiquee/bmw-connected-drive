import { Account } from "./Account";
import { fetch } from 'cross-fetch';
import { Constants } from "./Constants";
import { RemoteServices } from "./RemoteServices";
import { RemoteServiceExecutionState } from "./RemoteServiceExecutionState";
import { Regions } from "./Regions";
import { ITokenStore } from "./ITokenStore";
import { ILogger } from "./ILogger";
import { Capabilities, RemoteServiceRequestResponse, Vehicle, VehicleStatus } from "./VehicleApiResponse";
import { v4 as uuidv4 } from 'uuid';
import { Utils } from "./Utils";

export class ConnectedDrive {
    serviceExecutionStatusCheckInterval = 5000;
    account: Account;
    logger?: ILogger;

    constructor(username: string, password: string, region: Regions, tokenStore?: ITokenStore, logger?: ILogger) {
        this.account = new Account(username, password, region, tokenStore, logger);
        this.logger = logger;
    }

    async getVehicles(): Promise<Vehicle[]> {
        this.logger?.LogInformation("Getting vehicles");
        const params = `apptimezone=${120}&appDateTime=${Date.now()}`;
        const url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getVehicles}?${params}`;
        return (await this.request(url));
    }

    async getVehicleStatus(vin: string): Promise<VehicleStatus> {
        this.logger?.LogInformation("Getting vehicle status.");

        const params = `apptimezone=${120}&appDateTime=${Date.now()}`;
        const url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getVehicles}/state?${params}`;
        return (await this.request(url, false, null, { "bmw-vin": vin })).state;
    }

    async getVehicleCapabilities(vin: string): Promise<Capabilities> {
        this.logger?.LogInformation("Getting vehicle capabilities.");

        const params = `apptimezone=${120}&appDateTime=${Date.now()}`;
        const url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getVehicles}/state?${params}`;
        return (await this.request(url, false, null, { "bmw-vin": vin })).capabilities;
    }

    async lockDoors(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Locking doors");
        return await this.executeService(vin, RemoteServices.LockDoors, {}, waitExecution);
    }

    async unlockDoors(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Unlocking doors");
        return await this.executeService(vin, RemoteServices.UnlockDoors, {}, waitExecution);
    }

    async startClimateControl(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Start Climate Control");
        return await this.executeService(vin, RemoteServices.ClimateNow, { "action": "START" }, waitExecution);
    }

    async stopClimateControl(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Stop Climate Control");
        return await this.executeService(vin, RemoteServices.ClimateNow, { "action": "STOP" }, waitExecution);
    }

    async flashLights(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        return await this.executeService(vin, RemoteServices.FlashLight, {}, waitExecution);
    }

    async blowHorn(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Blow Horn");
        return await this.executeService(vin, RemoteServices.BlowHorn, {}, waitExecution);
    }

    async startCharging(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Start Charging");
        return await this.executeService(vin, RemoteServices.ChargeStart, {}, waitExecution, Constants.vehicleChargingStartStopUrl);
    }

    async stopCharging(vin: string, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Stop Charging");
        return await this.executeService(vin, RemoteServices.ChargeStop, {}, waitExecution, Constants.vehicleChargingStartStopUrl);
    }

    private async executeService(vin: string, serviceType: RemoteServices, params: { [key: string]: string }, waitExecution: boolean, remoteServiceUrl: string = Constants.executeRemoteServices): Promise<RemoteServiceRequestResponse> {
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}${remoteServiceUrl}`;
        url = url.replace("{vehicleVin}", vin);
        url = url.replace("{serviceType}", serviceType);

        if (Object.keys(params).length > 0) {
            const queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            
                url += `?${queryString}`;
        }

        const response: RemoteServiceRequestResponse = await this.request(url, true, {});

        if (waitExecution) {
            const timer = setInterval(async () => {
                const status = await this.getServiceStatus(response.eventId);
                if (status === RemoteServiceExecutionState.EXECUTED
                    || status === RemoteServiceExecutionState.CANCELLED_WITH_ERROR
                    || status === RemoteServiceExecutionState.ERROR) {
                    clearInterval(timer);
                }
            }, this.serviceExecutionStatusCheckInterval);
        }

        return response;
    }

    async getServiceStatus(eventId: string): Promise<RemoteServiceExecutionState> {
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.statusRemoteServices}`;
        url = url.replace("{eventId}", eventId);

        return (await this.request(url, true, {})).eventStatus;
    }

    async sendMessage(vin: string, subject: string, message: string): Promise<boolean> {
        // TODO: Cleanup
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}`;
        const requestBody = { "vins": [vin], "message": message, "subject": subject };

        return (await this.request(url, true, requestBody))?.status === "OK";
    }

    async request(url: string, isPost: boolean = false, requestBody?: any, headers: any = {}): Promise<any> {
        const correlationId = uuidv4();
        const httpMethod = isPost ? "POST" : "GET";
        const requestBodyContent = requestBody ? JSON.stringify(requestBody) : null;
        let retryCount = 0;

        headers["accept"] = "application/json";
        headers["accept-language"] = "en";
        headers["content-type"] = "application/json;charset=UTF-8";
        headers["authorization"] = `Bearer ${(await this.account.getToken()).accessToken}`;
        headers["user-agent"] = Constants.User_Agent;
        headers["x-user-agent"] = Constants.X_User_Agent[this.account.region];
        headers["x-identity-provider"] = "gcdm";
        headers["bmw-session-id"] = correlationId;
        headers["x-correlation-id"] = correlationId;
        headers["bmw-correlation-id"] = correlationId;

        if (requestBodyContent) {
            headers.Accept = "application/json;charset=utf-8";
        }

        let response : Response;
        let responseString : string;
        do {
            if (retryCount !== 0) {
                await Utils.Delay(2000, this.logger);
            }

            response = await fetch(url, {
                method: httpMethod,
                body: requestBodyContent,
                headers: headers,
                credentials: "same-origin"
            });
    
            responseString = await response.text();
    
            this.logger?.LogTrace(`Request: ${url}, Method: ${httpMethod}, Headers: ${JSON.stringify(headers)}, Body: ${requestBodyContent}`);
            this.logger?.LogTrace(`Response: ${response.status}, Headers: ${JSON.stringify(response.headers)}, Body: ${responseString}`);
        } while (retryCount++ < 5 && (response.status === 429 || (response.status === 403 && response.statusText.includes("quota"))));

        if (!response.ok) {
            throw new Error(`Error occurred while attempting '${httpMethod}' at url '${url}' with ${response.status} body (${requestBodyContent})\n${responseString}`);
        }

        return JSON.parse(responseString);
    }
}