import { RemoteServiceExecutionState } from "./RemoteServiceExecutionState";
import { RemoteServiceExecutionStateDetailed } from "./RemoteServiceExecutionStateDetailed";

export class DetailedServiceStatus {
    constructor(response : {
        "rsStatus": RemoteServiceExecutionState;
        "rsDetailedStatus": RemoteServiceExecutionStateDetailed;
        "initiationError": "NO_ERROR" | string;
        "rsError": "NO_ERROR" | string;
        "creationTime": string;
        "initStatus": true;
    }) {
        this.status = response.rsStatus;
        this.detailedStatus = response.rsDetailedStatus;
        this.initiationError = response.initiationError;
        this.error = response.rsError;
        this.creationTime = new Date(response.creationTime);
        this.initStatus = response.initStatus;
    }

    status! : RemoteServiceExecutionState;
    detailedStatus!: RemoteServiceExecutionStateDetailed;
    initiationError!: string;
    error!: string;
    creationTime! : Date;
    initStatus!: boolean;
}