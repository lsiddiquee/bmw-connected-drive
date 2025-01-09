import { Constants } from "./Constants";
import { Regions } from "./Regions";
import { Token } from "./Token"
import { ITokenStore } from "./ITokenStore";
import { LocalTokenStore } from "./LocalTokenStore";
import { ILogger } from "./ILogger";
import { Utils } from "./Utils";

import { v4 as uuid } from 'uuid';
import crypto from "crypto";
import {URLSearchParams} from "url";

const crossFetch = require('cross-fetch')
const fetch = require('fetch-cookie')(crossFetch)

export class Account {

    username: string;
    password: string;
    region: Regions;
    token?: Token;
    tokenStore?: ITokenStore;
    logger?: ILogger;
    captchaToken?: string;

    constructor(username: string, password: string, region: Regions, tokenStore?: ITokenStore, logger?: ILogger, captchaToken?: string) {
        this.username = username;
        this.password = password;
        this.region = region;
        this.tokenStore = tokenStore ?? new LocalTokenStore();
        this.logger = logger;
        this.captchaToken = captchaToken;
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
                    this.token = await this.refresh_token(this.token)
                } catch (_e) {
                    this.logger?.LogError("Error occurred while refreshing token. Attempting normal token retrieval.");
                    let e = _e as Error;
                    if (e) {
                        this.logger?.LogError(e.message);
                    }
                    // Intentional empty catch, as if the refresh failed, we can attempt a normal token retrieval.
                }
            } else {
                this.token = undefined;
            }
        }
        if (!this.token || !this.token?.accessToken) {
            if (this.captchaToken) {
                this.logger?.LogDebug("Getting token from token endpoint.");
                this.token = await this.login({
                    "grant_type": "authorization_code",
                    "username": this.username,
                    "password": this.password
                },
                undefined,
                undefined,
                this.captchaToken);
                this.captchaToken = undefined; // Delete because the captcha token is only valid for a short time and can only be used once
            } else {
                this.logger?.LogDebug("Missing captcha token for first authentication.");
            }
        }

        if (!this.token) {
            throw new Error("Error occurred while retrieving token.");
        }

        return this.token;
    }

    private async login(parameters: any, sessionId?: string, sessionCreated?: Date, captchaToken?: string): Promise<Token | undefined> {
        const authSettingsUrl: string = `https://${Constants.ServerEndpoints[this.region]}/eadrax-ucs/v1/presentation/oauth/config`;
        const correlationId = uuid();

        // If either sessionId is not provided or sessionCreated is not provided or sessionCreated is older than 14 days, create a new session.
        if (!sessionId || !sessionCreated || (sessionCreated && new Date(sessionCreated).getTime() < new Date().getTime() - (14 * 24 * 60 * 60 * 1000)))
        {
            sessionId = uuid();
            sessionCreated = new Date();
        }

        let serverResponse = await this.executeFetchWithRetry(authSettingsUrl, {
            method: "GET",
            headers: {
                "ocp-apim-subscription-key": Constants.ApimSubscriptionKey[this.region],
                "bmw-session-id": sessionId,
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
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        } as any;
        if (captchaToken) headers["hcaptchatoken"] = captchaToken;

        serverResponse = await this.executeFetchWithRetry(authenticateUrl, {
            method: "POST",
            body: new URLSearchParams(body),
            headers: headers,
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

        return this.buildTokenAndStore(data, sessionId, sessionCreated);
    }

    private async refresh_token(token: Token): Promise<Token | undefined> {
        const correlationId = uuid();

        // If either sessionId is not provided or sessionCreated is not provided or sessionCreated is older than 14 days, create a new session.
        if (!token.sessionId || !token.sessionCreated || (token.sessionCreated && new Date(token.sessionCreated).getTime() < new Date().getTime() - (14 * 24 * 60 * 60 * 1000)))
        {
            token.sessionId = uuid();
            token.sessionCreated = new Date();
        }

        const authSettingsUrl: string = `https://${Constants.ServerEndpoints[this.region]}/eadrax-ucs/v1/presentation/oauth/config`;
        let serverResponse = await this.executeFetchWithRetry(authSettingsUrl, {
            method: "GET",
            headers: {
                "ocp-apim-subscription-key": Constants.ApimSubscriptionKey[this.region],
                "bmw-session-id": token.sessionId,
                "x-identity-provider": "gcdm",
                "x-correlation-id": correlationId,
                "bmw-correlation-id": correlationId
            },
            credentials: "same-origin"
        }, response => response.ok);

        let data = await serverResponse.json();
        
        const body = {
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
            scope: data.scopes.join(" "),
            redirect_uri: data.returnUrl,
        };

        this.logger?.LogTrace(JSON.stringify(body));

        let basicAuth: string = Buffer.from(`${data.clientId}:${data.clientSecret}`).toString('base64');
        const headers = {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        } as any;

        serverResponse = await this.executeFetchWithRetry(data.tokenEndpoint, {
            method: "POST",
            body: new URLSearchParams(body),
            headers: headers,
            credentials: "same-origin"
        }, response => response.ok);

        data = await serverResponse.json();

        return this.buildTokenAndStore(data, token.sessionId, token.sessionCreated);
    }

    private async executeFetchWithRetry(url: string, init: any, responseValidator: (response: Response) => boolean): Promise<Response> {
        const correlationId = uuid();
        let response: Response;
        let retryCount = 0;
        init.headers["user-agent"] = Constants.User_Agent;
        init.headers["x-user-agent"] = Constants.X_User_Agent(this.region);
        init.headers["x-identity-provider"] = "gcdm";
        init.headers["bmw-session-id"] = correlationId;
        init.headers["x-correlation-id"] = correlationId;
        init.headers["bmw-correlation-id"] = correlationId;

        do {
            response = await fetch(url, init);
            retryCount++;
        } while (retryCount < 10 && !responseValidator(response) && (await Utils.Delay(1000, this.logger)));

        if (!responseValidator(response)) {
            this.logger?.LogError(`${response.status}: Error occurred while attempting to retrieve token. Server response: ${(await response.text())}`);
            throw new Error(`${response.status}: Error occurred while attempting to retrieve token.`);
        }

        return response;
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
    
    private buildTokenAndStore(data: any, sessionId: string, sessionCreated: Date) : Token {
        let token: Token = {
            response: JSON.stringify(data),
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            validUntil: new Date(new Date().getTime() + ((data.expires_in - 5) * 1000)),
            sessionId: sessionId,
            sessionCreated: sessionCreated
        };

        if (this.tokenStore) {
            this.logger?.LogDebug("Storing token in token store.");
            this.tokenStore.storeToken(token);
        }

        return token;
    }
}