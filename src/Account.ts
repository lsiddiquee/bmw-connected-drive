import { Constants } from "./Constants";
import { Regions } from "./Regions";
import { Token } from "./Token"
import { ITokenStore } from "./ITokenStore";
import { LocalTokenStore } from "./LocalTokenStore";
import { ILogger } from "./ILogger";
import {v4 as uuidv4} from 'uuid';

import crypto from "crypto";
import {URLSearchParams} from "url";
import { Units } from "./Units";

const crossFetch = require('cross-fetch')
const fetch = require('fetch-cookie')(crossFetch)

export class Account {

    username: string;
    password: string;
    region: Regions;
    unit: Units;
    token?: Token;
    tokenStore?: ITokenStore;
    logger?: ILogger;
    session_id: string = uuidv4();

    constructor(username: string, password: string, region: Regions, tokenStore?: ITokenStore, logger?: ILogger, unit: Units = Units.KM_L) {
        this.username = username;
        this.password = password;
        this.region = region;
        this.unit = unit;
        this.tokenStore = tokenStore ?? new LocalTokenStore();
        this.logger = logger;
    }

    async getToken(): Promise<Token> {
        if (!this.token && this.tokenStore) {
            this.logger?.LogDebug("Attempting retrieving token from token store.");
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
            } else {
                this.token = undefined;
            }
        }
        if (!this.token || !this.token?.accessToken) {
            this.logger?.LogDebug("Getting token from token endpoint.");
            this.token = await this.retrieveToken({
                "grant_type": "authorization_code",
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
        const authSettingsUrl: string = `https://${Constants.ServerEndpoints[this.region]}/eadrax-ucs/v1/presentation/oauth/config`;
        const correlationId = uuidv4();

        let serverResponse = await this.executeFetchWithRetry(authSettingsUrl, {
            method: "GET",
            headers: {
                "ocp-apim-subscription-key": Constants.OAuthAuthorizationKey[this.region],
                "bmw-session-id": this.session_id,
                "x-identity-provider": "gcdm",
                "x-correlation-id": correlationId,
                "bmw-correlation-id": correlationId
            },
            credentials: "same-origin"
        }, response => response.ok);

        let data = await serverResponse.json();
        const clientId = data.clientId;
        const clientSecret = data.clientSecret;
        const code_verifier = Account.base64UrlEncode(crypto.randomBytes(64));
        const hash = crypto.createHash('sha256');
        const code_challenge = Account.base64UrlEncode(hash.update(code_verifier).digest());
        const state = Account.base64UrlEncode(crypto.randomBytes(16));
        const tokenUrl = data.tokenEndpoint;
        const returnUrl = data.returnUrl;

        const baseOAuthParams = {
            client_id: clientId,
            response_type: "code",
            redirect_uri: returnUrl,
            state: state,
            nonce: "login_nonce",
            scope: data.scopes.join(" "),
            code_challenge: code_challenge,
            code_challenge_method: "S256"
        };

        let body = {...baseOAuthParams, ...parameters};
        this.logger?.LogTrace(JSON.stringify(body));

        const authenticateUrl = data.tokenEndpoint.replace("/token", "/authenticate");
        serverResponse = await this.executeFetchWithRetry(authenticateUrl, {
            method: "POST",
            body: new URLSearchParams(body),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            credentials: "same-origin"
        }, response => response.ok);

        data = await serverResponse.json();
        const authorization = Account.getQueryStringValue(data.redirect_to, "authorization");

        this.logger?.LogTrace(authorization);

        body = {...baseOAuthParams, ...{authorization: authorization}};
        this.logger?.LogTrace(JSON.stringify(body));
        serverResponse = await this.executeFetchWithRetry(authenticateUrl, {
            method: "POST",
            body: new URLSearchParams(body),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            redirect: "manual",
            credentials: "same-origin"
        }, response => response.status === 302);

        const nextUrl = serverResponse.headers.get("location") as string;
        this.logger?.LogTrace(nextUrl);
        const code = Account.getQueryStringValue(nextUrl, "code");

        this.logger?.LogTrace(JSON.stringify(code));

        const authHeaderValue = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        serverResponse = await this.executeFetchWithRetry(tokenUrl, {
            method: "POST",
            body: new URLSearchParams({
                code: code,
                code_verifier: code_verifier,
                redirect_uri: returnUrl,
                grant_type: "authorization_code"
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                authorization: `Basic ${authHeaderValue}`
            },
            credentials: "same-origin"
        }, response => response.ok);

        data = await serverResponse.json();

        this.token = {
            response: JSON.stringify(data),
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

    private async executeFetchWithRetry(url: string, init: any, responseValidator: (response: Response) => boolean): Promise<Response> {
        const correlationId = uuidv4();
        let response: Response;
        let retryCount = 0;
        init.headers["user-agent"] = Constants.User_Agent;
        init.headers["x-user-agent"] = Constants.X_User_Agent[this.region];
        init.headers["x-identity-provider"] = "gcdm";
        init.headers["bmw-session-id"] = correlationId;
        init.headers["x-correlation-id"] = correlationId;
        init.headers["bmw-correlation-id"] = correlationId;

        do {
            response = await fetch(url, init);
            retryCount++;
        } while (retryCount < 10 && !responseValidator(response) && (await this.delay(1000)));

        if (!responseValidator(response)) {
            this.logger?.LogError(`${response.status}: Error occurred while attempting to retrieve token. Server response: ${(await response.text())}`);
            throw new Error(`${response.status}: Error occurred while attempting to retrieve token.`);
        }

        return response;
    }

    private async delay(ms: number): Promise<boolean> {
        this.logger?.LogTrace("Sleeping for retry.")
        await new Promise(resolve => setTimeout(resolve, ms));
        return true;
    }

    private static getQueryStringValue(url: string, queryParamName: string): string {
        const splitUrl = url?.split("?");
        const queryString = splitUrl.length > 1 ? splitUrl[1] : splitUrl[0];
        const parsedQueryString = queryString?.split("&");
        if (!parsedQueryString) {
            throw new Error(`Url: '${url}' does not contain query string.`);
        }
        for (const param of parsedQueryString) {
            const paramKeyValue = param.split("=");
            if (paramKeyValue[0].toLowerCase() === queryParamName) {
                return paramKeyValue[1];
            }
        }

        throw new Error(`Url: '${url}' does not contain parameter '${queryParamName}'.`);
    }
    
    private static base64UrlEncode(buffer: Buffer):string{
        return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
}