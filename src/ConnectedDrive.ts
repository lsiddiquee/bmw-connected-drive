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

export class ConnectedDrive {
    serviceExecutionStatusCheckInterval = 5000;
    account: Account;
    logger?: ILogger;

    constructor(username: string, password: string, region: Regions, tokenStore?: ITokenStore, logger?: ILogger) {
        this.account = new Account(username, password, region, tokenStore);
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

    private async executeService(vin: string, serviceType: RemoteServices, requestBody: any, waitExecution: boolean): Promise<RemoteServiceRequestResponse> {
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.executeRemoteServices}`;
        url = url.replace("{vehicleVin}", vin);
        url = url.replace("{serviceType}", serviceType);
        const response: RemoteServiceRequestResponse = await this.request(url, true, requestBody);

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

        headers["Accept"] = "application/json";
        headers["accept-language"] = "en";
        headers["Content-Type"] = "application/json;charset=UTF-8";
        headers["Authorization"] = `Bearer ${(await this.account.getToken()).accessToken}`;
        headers["user-agent"] = Constants.User_Agent;
        headers["x-user-agent"] = Constants.X_User_Agent[this.account.region];
        headers["x-identity-provider"] = "gcdm";
        headers["bmw-session-id"] = correlationId;
        headers["x-correlation-id"] = correlationId;
        headers["bmw-correlation-id"] = correlationId;

        if (requestBodyContent) {
            headers.Accept = "application/json;charset=utf-8";
        }

        const response = await fetch(url, {
            method: httpMethod,
            body: requestBodyContent,
            headers: headers,
            credentials: "same-origin"
        });

        const responseString = await response.text();

        this.logger?.LogTrace(`Request: ${url}, Method: ${httpMethod}, Headers: ${JSON.stringify(headers)}, Body: ${requestBodyContent}`);
        this.logger?.LogTrace(`Response: ${response.status}, Headers: ${JSON.stringify(response.headers)}, Body: ${responseString}`);

        if (!response.ok) {
            throw new Error(`Error occurred while attempting '${httpMethod}' at url '${url}' with ${response.status} body (${requestBodyContent})\n${responseString}`);
        }

        return JSON.parse(responseString);
    }
}