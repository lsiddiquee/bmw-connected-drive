import { DetailedServiceStatus } from "./DetailedServiceStatus";
import { RemoteServiceExecutionState } from "./RemoteServiceExecutionState";
import { RemoteServiceExecutionStateDetailed } from "./RemoteServiceExecutionStateDetailed";
import { RemoteServices } from "./RemoteServices";

export class ServiceStatus {
    constructor(response: {
        "event": {
            "eventId": string;
            "rsType": RemoteServices;
            "rsTypeVersion": "v1";
            "vin": string;
            "userid": string;
            "creationTime": string;
            "lastUpdated": string;
            "rsEventStatus": RemoteServiceExecutionState;
            "requestParams": string;
            /** List of concluded events. The list is *not* sorted by time. */
            "actions": {
                "rsStatus": RemoteServiceExecutionState;
                "rsDetailedStatus": RemoteServiceExecutionStateDetailed;
                "initiationError": "NO_ERROR" | string;
                "rsError": "NO_ERROR" | string;
                "creationTime": string;
                "initStatus": true;
            }[];
            "uploads": [];
        }
    }) {
        this.eventId = response.event.eventId;
        this.serviceType = response.event.rsType;
        this.vin = response.event.vin;
        this.creationTime = new Date(response.event.creationTime);
        this.lastUpdated = new Date(response.event.lastUpdated);
        this.status = response.event.rsEventStatus;
        this.requestParams = response.event.requestParams;
        this.actions = response.event.actions.map(action => new DetailedServiceStatus(action));
    }

    eventId!: string;
    serviceType!: RemoteServices;
    vin!: string;
    creationTime!: Date;
    lastUpdated!: Date;
    status!: RemoteServiceExecutionState;
    requestParams!: string;
    actions?: DetailedServiceStatus[];
}