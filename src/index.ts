import {LogLevel} from "./LogLevel"
import {ILogger} from "./ILogger"
import {LoggerBase} from "./LoggerBase"
import {ITokenStore} from "./ITokenStore"
import {Token} from "./Token"
import {Regions} from "./Regions"
import {Account} from "./Account"
import {ConnectedDrive} from "./ConnectedDrive"
import {Vehicle} from "./Vehicle"
import {VehicleStatus} from "./VehicleStatus"
import {RemoteServices} from "./RemoteServices"
import {RemoteServiceResponse} from "./RemoteServiceResponse"
import {ServiceStatus} from "./ServiceStatus"
import {DetailedServiceStatus} from "./DetailedServiceStatus"
import {RemoteServiceExecutionState} from "./RemoteServiceExecutionState"
import {RemoteServiceExecutionStateDetailed} from "./RemoteServiceExecutionStateDetailed"
import {LocalTokenStore} from "./LocalTokenStore";
import {ConsoleLogger} from "./ConsoleLogger";

export { LogLevel, ILogger, LoggerBase, ITokenStore, Token, Regions, Account, ConnectedDrive, Vehicle, VehicleStatus, RemoteServices, RemoteServiceResponse, ServiceStatus, DetailedServiceStatus, RemoteServiceExecutionState, RemoteServiceExecutionStateDetailed }

const connectedDrive = new ConnectedDrive("likhan_s@hotmail.com", "sYL9r30r2MZj", Regions.RestOfWorld, new LocalTokenStore(), new ConsoleLogger());
connectedDrive.account.getToken().then(token => {
   console.log(token);
   connectedDrive.getVehicles().then(vehicles =>{
      vehicles.forEach(v => console.log(v.vin));
   });   
});

