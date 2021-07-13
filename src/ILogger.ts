import { LogLevel } from "./LogLevel";

export interface ILogger {
    Log(level: LogLevel, message: string): void;

    LogTrace(message: string): void;

    LogDebug(message: string): void;

    LogInformation(message: string): void;

    LogWarning(message: string): void;

    LogError(message: string): void;

    LogCritical(message: string): void;
}