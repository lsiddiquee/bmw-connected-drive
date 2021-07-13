import { Constants } from "./Constants";
import { Regions } from "./Regions";
import { Token } from "./Token"
import { fetch } from 'cross-fetch';
import { ITokenStore } from "./ITokenStore";
import { LocalTokenStore } from "./LocalTokenStore";
import { ILogger } from "./ILogger";

export class Account {

    username: string;
    password: string;
    region: Regions;
    token?: Token;
    tokenStore?: ITokenStore;
    logger?: ILogger;

    constructor(username: string, password: string, region: Regions, tokenStore?: ITokenStore, logger?: ILogger) {
        this.username = username;
        this.password = password;
        this.region = region;
        this.tokenStore = tokenStore ?? new LocalTokenStore();
        this.logger = logger;
    }

    async getToken(): Promise<Token> {
        if (!this.token && this.tokenStore) {
            this.logger?.LogDebug("Attempting retreiving token from token store.");
            this.token = this.tokenStore.retrieveToken() as Token;
        }
        if (this.token && new Date() > this.token.validUntil) {
            this.logger?.LogDebug("Token expired.");
            if (this.token.refreshToken) {
                this.logger?.LogDebug("Attempting refreshing.");
                try {
                    const refreshToken = this.token.refreshToken;
                    this.token = undefined;
                    this.token = await this.retrieveToken({
                        "grant_type": "refresh_token",
                        "refresh_token": refreshToken
                    })
                } catch {
                    // Intentional empty catch, as if the refresh failed, we can attempt a normal token retrieval.
                }
            }
            else {
                this.token = undefined;
            }
        }
        if (!this.token || !this.token?.accessToken) {
            this.logger?.LogDebug("Getting token from token endpoint.");
            this.token = await this.retrieveToken({
                "grant_type": "password",
                "username": this.username,
                "password": this.password
            })
        }

        if (!this.token) {
            throw new Error("Error occurred while retrieving token.");
        }

        return this.token;
    }

    private async retrieveToken(parameters: any): Promise<Token | undefined> {
        parameters["scope"] = "authenticate_user vehicle_data remote_services";
        const tokenUrl: string = `https://${Constants.OAuthEndpoints[this.region]}/oauth/token`;

        const serverResponse = await fetch(tokenUrl, {
            method: "POST",
            body: new URLSearchParams(parameters),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Authorization": `Basic ${Constants.OAuthAuthorization[this.region]}`,
                "Credentials": "nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ"
            }
        });

        const responseString = await serverResponse.text();

        if (!serverResponse.ok) {
            this.logger?.LogError(`${serverResponse.status}: Error occurred while attempting to retrieve token. Server response: ${responseString}`);
            throw new Error(`${serverResponse.status}: Error occurred while attempting to retrieve token.`);
        }

        this.logger?.LogTrace(`Token response: ${responseString}`);

        const data = JSON.parse(responseString);
        this.token = {
            response: responseString,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            validUntil: new Date(new Date().getTime() + ((data.expires_in - 5) * 1000))
        };

        if (this.tokenStore) {
            this.logger?.LogDebug("Storing token in token store.");
            this.tokenStore.storeToken(this.token);
        }

        return this.token;
    }
}