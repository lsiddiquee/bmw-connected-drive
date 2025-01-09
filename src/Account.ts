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
                    this.token = undefined;
                    this.logger?.LogError("Error occurred while refreshing token. Attempting normal token retrieval.");
                    let e = _e as Error;
                    if (e) {
                        this.logger?.LogError(e.message);
                    }
                }
            } else {
                this.token = undefined;
            }
        }
        if (!this.token || !this.token.accessToken) {
            if (this.captchaToken) {
                this.logger?.LogDebug("Getting token from token endpoint.");
                this.token = await this.login(
                    this.username,
                    this.password,
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

    private async login(username: string, password: string, captchaToken: string): Promise<Token> {
        const oauthConfig = await this.retrieveOAuthConfig();

        const code_verifier = Account.base64UrlEncode(crypto.randomBytes(64));
        const hash = crypto.createHash('sha256');
        const code_challenge = Account.base64UrlEncode(hash.update(code_verifier).digest());
        const state = Account.base64UrlEncode(crypto.randomBytes(16));

        const baseOAuthParams = {
            client_id: oauthConfig.clientId,
            response_type: "code",
            redirect_uri: oauthConfig.returnUrl,
            state: state,
            nonce: "login_nonce",
            scope: oauthConfig.scopes.join(" "),
            code_challenge: code_challenge,
            code_challenge_method: "S256"
        };

        const authenticateUrl = oauthConfig.tokenEndpoint.replace("/token", "/authenticate");
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "hcaptchatoken": captchaToken
        } as any;

        let serverResponse = await this.executeFetchWithRetry(authenticateUrl, {
            method: "POST",
            body: new URLSearchParams({
                ...{
                    grant_type: "authorization_code",
                    username: username,
                    password: password
                },
                ...baseOAuthParams
            }),
            headers: headers,
            credentials: "same-origin"
        }, response => response.ok);

        let data = await serverResponse.json();
        const authorization = Account.getQueryStringValue(data.redirect_to, "authorization");

        this.logger?.LogTrace(authorization);

        serverResponse = await this.executeFetchWithRetry(authenticateUrl, {
            method: "POST",
            body: new URLSearchParams({...baseOAuthParams, ...{authorization: authorization}}),
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

        const authHeaderValue = Buffer.from(`${oauthConfig.clientId}:${oauthConfig.clientSecret}`).toString('base64');
        
        serverResponse = await this.executeFetchWithRetry(oauthConfig.tokenEndpoint, {
            method: "POST",
            body: new URLSearchParams({
                code: code,
                code_verifier: code_verifier,
                redirect_uri: oauthConfig.returnUrl,
                grant_type: "authorization_code"
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                authorization: `Basic ${authHeaderValue}`
            },
            credentials: "same-origin"
        }, response => response.ok);

        data = await serverResponse.json();

        return this.buildTokenAndStore(data);
    }

    private async refresh_token(token: Token): Promise<Token | undefined> {
        const oauthConfig = await this.retrieveOAuthConfig();
        
        const authHeaderValue: string = Buffer.from(`${oauthConfig.clientId}:${oauthConfig.clientSecret}`).toString('base64');

        let serverResponse = await this.executeFetchWithRetry(oauthConfig.tokenEndpoint, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
                scope: oauthConfig.scopes.join(" "),
                redirect_uri: oauthConfig.returnUrl,
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                authorization: `Basic ${authHeaderValue}`
            },
            credentials: "same-origin"
        }, response => response.ok);

        let data = await serverResponse.json();

        return this.buildTokenAndStore(data);
    }

    private async retrieveOAuthConfig() {
        const authSettingsUrl: string = `https://${Constants.ServerEndpoints[this.region]}/eadrax-ucs/v1/presentation/oauth/config`;
        let serverResponse = await this.executeFetchWithRetry(authSettingsUrl, {
            method: "GET",
            headers: {
                "ocp-apim-subscription-key": Constants.ApimSubscriptionKey[this.region],
                "x-identity-provider": "gcdm",
            },
            credentials: "same-origin"
        }, response => response.ok);

        return await serverResponse.json();
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
    
    private buildTokenAndStore(data: any) : Token {
        let token: Token = new Token({
            response: JSON.stringify(data),
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            validUntil: new Date(new Date().getTime() + ((data.expires_in - 5) * 1000))
        });

        if (this.tokenStore) {
            this.logger?.LogDebug("Storing token in token store.");
            this.tokenStore.storeToken(token);
        }

        return token;
    }
}