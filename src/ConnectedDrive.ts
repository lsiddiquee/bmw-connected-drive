import { Account } from "./Account";
import { fetch } from 'cross-fetch';
import { Constants } from "./Constants";
import { Vehicle } from "./Vehicle";
import { RemoteServices } from "./RemoteServices";
import { RemoteServiceResponse } from "./RemoteServiceResponse";
import { ServiceStatus } from "./ServiceStatus";
import { VehicleStatus } from "./VehicleStatus";
import { RemoteServiceExecutionState } from "./RemoteServiceExecutionState";
import { Regions } from "./Regions";
import { ITokenStore } from "./ITokenStore";
import { ILogger } from "./ILogger";

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
        const url: string = `https://${Constants.LegacyServerEndpoints[this.account.region]}/webapi/v1/user/vehicles`;
        return (await this.request(url)).vehicles;
    }

    async getVehicleStatus(vin: string): Promise<VehicleStatus> {
        this.logger?.LogInformation("Getting vehicle status.");
        let url: string = `https://${Constants.LegacyServerEndpoints[this.account.region]}${Constants.getVehicleStatus}`;
        url = url.replace("{vehicleVin}", vin);

        return new VehicleStatus(await this.request(url));
    }

    async lockDoors(vin: string, waitExecution: boolean = false): Promise<RemoteServiceResponse> {
        this.logger?.LogInformation("Locking doors");
        return await this.executeService(vin, RemoteServices.LockDoors, { "clientId": 2, "doorControl": "LOCK" }, waitExecution);
    }

    async unlockDoors(vin: string, waitExecution: boolean = false): Promise<RemoteServiceResponse> {
        this.logger?.LogInformation("Unlocking doors");
        return await this.executeService(vin, RemoteServices.UnlockDoors, { "clientId": 2, "doorSelection": "COMPLETE" }, waitExecution);
    }

    async startClimateControl(vin: string, waitExecution: boolean = false): Promise<RemoteServiceResponse> {
        this.logger?.LogInformation("Start Climate Control");
        return await this.executeService(vin, RemoteServices.ClimateNow, { "rcnAction": "START" }, waitExecution);
    }

    async stopClimateControl(vin: string, waitExecution: boolean = false): Promise<RemoteServiceResponse> {
        this.logger?.LogInformation("Stop Climate Control");
        return await this.executeService(vin, RemoteServices.ClimateNow, { "rcnAction": "STOP" }, waitExecution);
    }

    async flashLights(vin: string, waitExecution: boolean = false): Promise<RemoteServiceResponse> {
        return await this.executeService(vin, RemoteServices.FlashLight, { "number": 2, "pause": 1, "duration": 1 }, waitExecution);
    }

    async blowHorn(vin: string, waitExecution: boolean = false): Promise<RemoteServiceResponse> {
        this.logger?.LogInformation("Blow Horn");
        return await this.executeService(vin, RemoteServices.BlowHorn, { "number": 2, "pause": 1, "duration": 1 }, waitExecution);
    }

    private async executeService(vin: string, serviceType: RemoteServices, requestBody: any, waitExecution: boolean): Promise<RemoteServiceResponse> {
        let url: string = `https://${Constants.LegacyServerEndpoints[this.account.region]}${Constants.executeRemoteServices}`;
        url = url.replace("{vehicleVin}", vin);
        url = url.replace("{serviceType}", serviceType);
        const response = new RemoteServiceResponse(await this.request(url, true, requestBody));

        if (waitExecution) {
            const timer = setInterval(async () => {
                const status = await this.getServiceStatus(vin);
                if (status.status === RemoteServiceExecutionState.EXECUTED || status.status === RemoteServiceExecutionState.CANCELLED_WITH_ERROR) {
                    clearInterval(timer);
                }
            }, this.serviceExecutionStatusCheckInterval);
        }

        return response;
    }

    async getServiceStatus(vin: string): Promise<ServiceStatus> {
        let url: string = `https://${Constants.LegacyServerEndpoints[this.account.region]}${Constants.statusRemoteServices}`;
        url = url.replace("{vehicleVin}", vin);

        return new ServiceStatus(await this.request(url));
    }

    async sendMessage(vin: string, subject: string, message: string): Promise<boolean> {
        let url: string = `https://${Constants.LegacyServerEndpoints[this.account.region]}${Constants.sendMessage}`;
        const requestBody = {"vins": [vin], "message": message, "subject": subject};

        return (await this.request(url, true, requestBody))?.status === "OK";
    }

    async request(url: string, isPost: boolean = false, requestBody?: any): Promise<any> {
        const httpMethod = isPost ? "POST" : "GET";
        const requestBodyContent = requestBody ? JSON.stringify(requestBody) : null;
        const headers : any = {
            "accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Authorization": `Bearer ${(await this.account.getToken()).accessToken}`,
            "x-user-agent": "android(v1.07_20200330);bmw;1.7.0(11152)"
        }
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