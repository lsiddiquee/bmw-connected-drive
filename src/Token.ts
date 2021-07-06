export class Token {
    response: string;
    accessToken: string;
    refreshToken: string;
    validUntil: Date;

    constructor({ response, accessToken, refreshToken, validUntil }
        : { response: string, accessToken: string, refreshToken: string, validUntil: Date }) {
        this.response = response;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.validUntil = validUntil;
    }
}