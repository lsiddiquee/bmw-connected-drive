import { ITokenStore } from "./ITokenStore";
import { Token } from "./Token";

export class LocalTokenStore implements ITokenStore {
    private token: Token | undefined;

    storeToken(token: Token): void {
        this.token = token;
    }
    retrieveToken(): Token | undefined {
        return this.token;
    }
}