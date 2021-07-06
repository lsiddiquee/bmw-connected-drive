export class RemoteServiceResponse {
    constructor(response: {
        "eventId": {
            "eventId": string
        },
        "vin": string,
        "creationTime": string
    }) {
        this.eventId = response.eventId.eventId;
        this.vin = response.vin;
        this.creationTime = new Date(response.creationTime);
    }

    eventId!: string;
    vin!: string;
    creationTime!: Date;
}