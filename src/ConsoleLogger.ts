import {ILogger} from "./ILogger";
import {LogLevel} from "./LogLevel";
import {LoggerBase} from "./LoggerBase";

export class ConsoleLogger extends  LoggerBase {
    Log(level: LogLevel, message: string): void {
        console.log(`${level}: ${message}`);
    }
}