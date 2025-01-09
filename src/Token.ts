import { v4 as uuid } from 'uuid';

export class Token {
    response: string;
    accessToken: string;
    refreshToken: string;
    validUntil: Date;
    sessionId: string;
    sessionCreated: Date;

    constructor({ response, accessToken, refreshToken, validUntil, sessionId, sessionCreated }
        : { response: string, accessToken: string, refreshToken: string, validUntil: Date, sessionId: string, sessionCreated: Date }) {
        this.response = response;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.validUntil = validUntil;
        this.sessionId = sessionId;
        this.sessionCreated = sessionCreated;
    }
}