import { LogLevel } from "./LogLevel"
import { ILogger } from "./ILogger"
import { LoggerBase } from "./LoggerBase"
import { ITokenStore } from "./ITokenStore"
import { Token } from "./Token"
import { Regions } from "./Regions"
import { Account } from "./Account"
import { ConnectedDrive } from "./ConnectedDrive"
import { RemoteServices } from "./RemoteServices"
import { DetailedServiceStatus } from "./DetailedServiceStatus"
import { RemoteServiceExecutionState } from "./RemoteServiceExecutionState"
import { RemoteServiceExecutionStateDetailed } from "./RemoteServiceExecutionStateDetailed"
import { FileTokenStore } from "./FileTokenStore"
import { ConsoleLogger } from "./ConsoleLogger"

export { LogLevel, ILogger, LoggerBase, ITokenStore, Token, Regions, Account, ConnectedDrive, RemoteServices, DetailedServiceStatus, RemoteServiceExecutionState, RemoteServiceExecutionStateDetailed }

// Setup the API client
const api = new ConnectedDrive(
    String(process.env.BMWUsername),
    String(process.env.BMWPassword),
    Regions.RestOfWorld,
    new FileTokenStore(),
    new ConsoleLogger());

// Fetch a list of vehicles associated with the credentials

// api.getVehicles().then(vehicles => {
//     vehicles.forEach(vehicle => {
//         console.log(vehicle.vin);
//         console.log(vehicle.properties);
//     })
// }).catch(reason => {
//     console.log(reason);
// });

api.lockDoors("WBAJA91000CD48772", true).then(r => {
    console.log(r.eventId);
}).catch(reason => {
    console.log(reason);
});