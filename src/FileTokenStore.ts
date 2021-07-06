import { ITokenStore } from "./ITokenStore";
import { Token } from "./Token";
import { readFileSync, writeFileSync, existsSync } from 'fs';

// TODO: Cleanup to ensure that we are not using NodeJS only features.
export class FileTokenStore implements ITokenStore {
    readonly fileName: string = "access_token";

    storeToken(token: Token): void {
        writeFileSync(this.fileName, JSON.stringify(token), 'utf8');
    }
    retrieveToken(): Token | undefined {
        if (existsSync(this.fileName)) {
            const fileContent: string = readFileSync(this.fileName, 'utf8');

            const token = JSON.parse(fileContent) as Token;
            if (token) {
                token.validUntil = new Date(token.validUntil);
            }

            return token;
        }

        return undefined;
    }
}