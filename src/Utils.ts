import { ILogger } from "./ILogger";

export class Utils {
    public static async Delay(ms: number, logger?: ILogger): Promise<boolean> {
        logger?.LogTrace("Sleeping for retry.")
        await new Promise(resolve => setTimeout(resolve, ms));
        return true;
    }
}