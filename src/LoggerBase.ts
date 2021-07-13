import { ILogger } from "./ILogger";
import { LogLevel } from "./LogLevel";

export abstract class LoggerBase implements ILogger {
    abstract Log(level: LogLevel, message: string): void;

    LogTrace(message: string) {
        this.Log(LogLevel.Trace, message);
    }

    LogDebug(message: string) {
        this.Log(LogLevel.Debug, message);
    }

    LogInformation(message: string) {
        this.Log(LogLevel.Information, message);
    }

    LogWarning(message: string) {
        this.Log(LogLevel.Warning, message);
    }

    LogError(message: string) {
        this.Log(LogLevel.Error, message);
    }

    LogCritical(message: string) {
        this.Log(LogLevel.Critical, message);
    }
}