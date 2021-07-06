import { Token } from "./Token";

export interface ITokenStore {
    storeToken(token : Token) : void;
    retrieveToken() : Token | undefined;
}