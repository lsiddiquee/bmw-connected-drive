import { Account } from "./Account";
import { fetch } from 'cross-fetch';
import { Constants } from "./Constants";
import { RemoteServices } from "./RemoteServices";
import { RemoteServiceExecutionState } from "./RemoteServiceExecutionState";
import { CarBrand } from "./CarBrand";
import { Regions } from "./Regions";
import { ITokenStore } from "./ITokenStore";
import { ILogger } from "./ILogger";
import { Capabilities, RemoteServiceRequestResponse, Vehicle, VehicleStatus } from "./VehicleApiResponse";
import { v4 as uuidv4 } from 'uuid';
import { Utils } from "./Utils";
import { CarView } from "./CarView";

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
        let result: Vehicle[] = [];
        for (let key in CarBrand) {
            const brand: CarBrand = CarBrand[key as keyof typeof CarBrand];

            this.logger?.LogInformation(`Getting ${brand} vehicles`);

            const url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getVehicles}?${params}`;
            let vehicles = await this.getFromJson(url, brand);
            result.push(...vehicles);
        }
        return (result);
    }

    async getVehicleStatus(vin: string, brand: CarBrand = CarBrand.Bmw): Promise<VehicleStatus> {
        this.logger?.LogInformation("Getting vehicle status.");

        const params = `apptimezone=${120}&appDateTime=${Date.now()}`;
        const url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getVehicles}/state?${params}`;
        return (await this.getFromJson(url, brand, { "bmw-vin": vin })).state;
    }

    async getVehicleCapabilities(vin: string, brand: CarBrand = CarBrand.Bmw): Promise<Capabilities> {
        this.logger?.LogInformation("Getting vehicle capabilities.");

        const params = `apptimezone=${120}&appDateTime=${Date.now()}`;
        const url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getVehicles}/state?${params}`;
        return (await this.getFromJson(url, brand, { "bmw-vin": vin })).capabilities;
    }

    async lockDoors(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Locking doors");
        return await this.executeService(vin, brand, RemoteServices.LockDoors, {}, waitExecution);
    }

    async unlockDoors(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Unlocking doors");
        return await this.executeService(vin, brand, RemoteServices.UnlockDoors, {}, waitExecution);
    }

    async startClimateControl(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Start Climate Control");
        return await this.executeService(vin, brand, RemoteServices.ClimateNow, { "action": "START" }, waitExecution);
    }

    async stopClimateControl(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Stop Climate Control");
        return await this.executeService(vin, brand, RemoteServices.ClimateNow, { "action": "STOP" }, waitExecution);
    }

    async flashLights(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        return await this.executeService(vin, brand, RemoteServices.FlashLight, {}, waitExecution);
    }

    async blowHorn(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Blow Horn");
        return await this.executeService(vin, brand, RemoteServices.BlowHorn, {}, waitExecution);
    }

    async startCharging(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Start Charging");
        return await this.executeService(vin, brand, RemoteServices.ChargeStart, {}, waitExecution, Constants.vehicleChargingStartStopUrl);
    }

    async stopCharging(vin: string, brand: CarBrand = CarBrand.Bmw, waitExecution: boolean = false): Promise<RemoteServiceRequestResponse> {
        this.logger?.LogInformation("Stop Charging");
        return await this.executeService(vin, brand, RemoteServices.ChargeStop, {}, waitExecution, Constants.vehicleChargingStartStopUrl);
    }

    private async executeService(vin: string, brand: CarBrand, serviceType: RemoteServices, params: { [key: string]: string }, waitExecution: boolean, remoteServiceUrl: string = Constants.executeRemoteServices): Promise<RemoteServiceRequestResponse> {
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}${remoteServiceUrl}`;
        url = url.replace("{vehicleVin}", vin);
        url = url.replace("{serviceType}", serviceType);

        const headers = {
            "bmw-vin": vin
        };

        if (Object.keys(params).length > 0) {
            const queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');

            url += `?${queryString}`;
        }

        const response: RemoteServiceRequestResponse = await this.postAsJson(url, brand, {}, headers);

        if (waitExecution) {
            let status: RemoteServiceExecutionState = RemoteServiceExecutionState.UNKNOWN;

            while (status !== RemoteServiceExecutionState.EXECUTED
                && status !== RemoteServiceExecutionState.CANCELLED_WITH_ERROR
                && status !== RemoteServiceExecutionState.ERROR) {
                status = await this.getServiceStatus(response.eventId, brand);
                await Utils.Delay(this.serviceExecutionStatusCheckInterval, this.logger);
            }
        }

        return response;
    }

    async getServiceStatus(eventId: string, brand: CarBrand = CarBrand.Bmw): Promise<RemoteServiceExecutionState> {
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.statusRemoteServices}`;
        url = url.replace("{eventId}", eventId);

        return (await this.postAsJson(url, brand)).eventStatus;
    }

    async getImage(vin: string, brand: CarBrand = CarBrand.Bmw, view: CarView): Promise<ArrayBuffer> {
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}${Constants.getImages}`;
        url = url.replace("{carView}", view);

        const headers = {
            "accept": "image/png",
            "bmw-app-vehicle-type": "connected",
            "bmw-vin": vin
        };

        const response = await this.get(url, brand, headers);
        return await response.arrayBuffer();
    }

    async sendMessage(vin: string, brand: CarBrand = CarBrand.Bmw, subject: string, message: string): Promise<boolean> {
        // TODO: Cleanup
        let url: string = `https://${Constants.ServerEndpoints[this.account.region]}`;
        const requestBody = { "vins": [vin], "message": message, "subject": subject };

        return (await this.postAsJson(url, brand, requestBody))?.status === "OK";
    }

    async get(url: string, brand: CarBrand = CarBrand.Bmw, headers: any = {}): Promise<Response> {
        return await this.request(url, brand, false, null, headers);
    }

    async getFromJson(url: string, brand: CarBrand = CarBrand.Bmw, headers: any = {}): Promise<any> {
        return (await this.get(url, brand, headers)).json();
    }

    async postAsJson(url: string, brand: CarBrand = CarBrand.Bmw, requestBody: any = {}, headers: any = {}): Promise<any> {
        return (await this.request(url, brand, true, requestBody, headers)).json();
    }

    async request(url: string, brand: CarBrand = CarBrand.Bmw, isPost: boolean = false, requestBody?: any, headers: any = {}): Promise<Response> {
        const correlationId = uuidv4();
        const httpMethod = isPost ? "POST" : "GET";
        const requestBodyContent = requestBody ? JSON.stringify(requestBody) : null;
        let retryCount = 0;

        const defaultHeaders = {
            "accept": "application/json",
            "accept-language": "en",
            "content-type": "application/json;charset=UTF-8",
            "authorization": `Bearer ${(await this.account.getToken()).accessToken}`,
            "user-agent": Constants.User_Agent,
            "x-user-agent": Constants.X_User_Agent(this.account.region, brand),
            "x-identity-provider": "gcdm",
            "bmw-session-id": correlationId,
            "x-correlation-id": correlationId,
            "bmw-correlation-id": correlationId
        };

        let response: Response;
        do {
            if (retryCount !== 0) {
                await Utils.Delay(2000, this.logger);
            }

            response = await fetch(url, {
                method: httpMethod,
                body: requestBodyContent,
                headers: { ...defaultHeaders, ...headers },
                credentials: "same-origin"
            });

            this.logger?.LogTrace(`Request: ${url}, Method: ${httpMethod}, Headers: ${JSON.stringify(headers)}, Body: ${requestBodyContent}`);
            this.logger?.LogTrace(`Response: ${response.status}, Headers: ${JSON.stringify(response.headers)}`);
        } while (retryCount++ < 5 && (response.status === 429 || (response.status === 403 && response.statusText.includes("quota"))));

        if (!response.ok) {
            throw new Error(`Error occurred while attempting '${httpMethod}' at url '${url}' with ${response.status} body (${requestBodyContent})\n${await response.text()}`);
        }

        return response;
    }
}