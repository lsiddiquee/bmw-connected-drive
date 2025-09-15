import { ILogger } from "./ILogger";
import * as os from 'os';
import * as crypto from 'crypto';

export class Utils {
    public static async Delay(ms: number, logger?: ILogger): Promise<boolean> {
        logger?.LogTrace("Sleeping for retry.")
        await new Promise(resolve => setTimeout(resolve, ms));
        return true;
    }

    /**
     * Gets a deterministic build string based on the machine's hostname.
     * This will be consistent for the same machine across reboots.
     */
    public static getXUserAgentBuildString(): string {
        const hostname = os.hostname();
        
        // Create a deterministic hash from hostname
        const hash = crypto.createHash('sha256').update(hostname).digest('hex').toUpperCase();
        
        // Extract digits from hash
        const digits = hash.replace(/[^0-9]/g, '');
        
        // Get 6-digit numeric component
        let numeric = digits.slice(0, 6) || '000000';
        numeric = numeric.padEnd(6, '0');
        
        // Get 3-digit build number
        let buildNum = digits.slice(-3) || '000';
        buildNum = buildNum.padStart(3, '0');
        
        return `AP2A.${numeric}.${buildNum}`;
    }
}