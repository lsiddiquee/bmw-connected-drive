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
import { Capabilities, ChargingProfile, ChargingSettings, CheckControlMessage, Coordinates, Address, DepartureTime, DriverGuideInfo,  ReductionOfChargeCurrent, RemoteServiceRequestResponse, RequiredService, TireStatus, TireStatusInfo, Vehicle, Attributes, SoftwareVersion, PuStep, MappingInfo, VehicleStatus, Time, ClimateControlState, ClimateTimer, CombustionFuelLevel, DoorsState, DriverPreferences, ElectricChargingState, TireStatuses, WindowsState, DigitalKey, RemoteChargingCommands, LocationInfo } from "./VehicleApiResponse"

export {
    LogLevel,
    ILogger,
    LoggerBase,
    ITokenStore,
    Token,
    Regions,
    Account,
    ConnectedDrive,
    RemoteServices,
    DetailedServiceStatus,
    RemoteServiceExecutionState,
    RemoteServiceExecutionStateDetailed,
    Vehicle,
    Attributes,
    DriverGuideInfo,
    SoftwareVersion,
    PuStep,
    MappingInfo,
    VehicleStatus,
    ChargingProfile,
    ChargingSettings,
    DepartureTime,
    Time,
    ReductionOfChargeCurrent,
    CheckControlMessage,
    ClimateControlState,
    ClimateTimer,
    CombustionFuelLevel,
    DoorsState,
    DriverPreferences,
    ElectricChargingState,
    LocationInfo,
    Address,
    Coordinates,
    RequiredService,
    TireStatuses,
    TireStatusInfo as TireStatusInternal,
    TireStatus,
    WindowsState,
    Capabilities,
    DigitalKey,
    RemoteChargingCommands,
    RemoteServiceRequestResponse
}

// Setup the API client
const api = new ConnectedDrive(process.env.BMW_CONNECTED_DRIVE_USERNAME ?? "", process.env.BMW_CONNECTED_DRIVE_PASSWORD ?? "", Regions.RestOfWorld, new FileTokenStore(), new ConsoleLogger());

// Fetch a list of vehicles associated with the credentials
api.getVehicles().then(vehicles => {
    console.log(vehicles)
    api.getVehicleStatus(vehicles[0].vin).then(v => {
        // console.log(v);
        // console.log(v.doorsState.combinedSecurityState);
        // console.log(v.doorsState.combinedState);
        console.log(v.currentMileage);
        console.log(v.range);
        console.log(v.electricChargingState.range);
        console.log(v.combustionFuelLevel);
        console.log(v.combustionFuelLevel.remainingFuelLiters);
        console.log(v.combustionFuelLevel.range);
    });
    // api.getVehicleCapabilities(vehicles[0].vin).then(v => console.log(v))
    // api.startClimateControl(vehicles[0].vin, true).then(response => console.log(response))
    // api.blowHorn(vehicles[0].vin, true).then(response => console.log(response))
}).catch(err => console.error(err));
