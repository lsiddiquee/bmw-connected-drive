import { CarBrand } from "./CarBrand";

export interface Vehicle {
    vin:            string;
    mappingInfo:    MappingInfo;
    appVehicleType: string;
    attributes:     Attributes;
}

export interface Attributes {
    lastFetched:              Date;
    model:                    string;
    year:                     number;
    color:                    number;
    brand:                    CarBrand;
    driveTrain:               string;
    headUnitType:             string;
    headUnitRaw:              string;
    hmiVersion:               string;
    softwareVersionCurrent:   SoftwareVersion;
    softwareVersionExFactory: SoftwareVersion;
    telematicsUnit:           string;
    bodyType:                 string;
    countryOfOrigin:          string;
    a4aType:                  string;
    driverGuideInfo:          DriverGuideInfo;
}

export interface DriverGuideInfo {
    androidAppScheme: string;
    iosAppScheme:     string;
    androidStoreUrl:  string;
    iosStoreUrl:      string;
}

export interface SoftwareVersion {
    puStep:        PuStep;
    iStep:         number;
    seriesCluster: string;
}

export interface PuStep {
    month: number;
    year:  number;
}

export interface MappingInfo {
    isAssociated:  boolean;
    isLmmEnabled:  boolean;
    mappingStatus: string;
    isPrimaryUser: boolean;
}

export interface VehicleStatus {
    isLeftSteering:        boolean;
    lastFetched:           Date;
    lastUpdatedAt:         Date;
    isLscSupported:        boolean;
    range:                 number;
    doorsState:            DoorsState;
    windowsState:          WindowsState;
    tireState:             TireStatuses;
    location:              LocationInfo;
    currentMileage:        number;
    climateControlState:   ClimateControlState;
    requiredServices:      RequiredService[];
    checkControlMessages:  CheckControlMessage[];
    chargingProfile:       ChargingProfile;
    electricChargingState: ElectricChargingState;
    combustionFuelLevel:   CombustionFuelLevel;
    driverPreferences:     DriverPreferences;
    isDeepSleepModeActive: boolean;
    climateTimers:         ClimateTimer[];
}

export interface ChargingProfile {
    chargingControlType:      string;
    reductionOfChargeCurrent: ReductionOfChargeCurrent;
    chargingMode:             string;
    chargingPreference:       string;
    departureTimes:           DepartureTime[];
    climatisationOn:          boolean;
    chargingSettings:         ChargingSettings;
}

export interface ChargingSettings {
    targetSoc:   number;
    idcc:        string;
    hospitality: string;
}

export interface DepartureTime {
    id:            number;
    timeStamp:     Time;
    action:        string;
    timerWeekDays: string[];
}

export interface Time {
    hour:   number;
    minute: number;
}

export interface ReductionOfChargeCurrent {
    start: Time;
    end:   Time;
}

export interface CheckControlMessage {
    type:     string;
    severity: string;
}

export interface ClimateControlState {
    activity: string;
}

export interface ClimateTimer {
    isWeeklyTimer: boolean;
    timerAction:   string;
    timerWeekDays: string[];
    departureTime: Time;
}

export interface CombustionFuelLevel {
    remainingFuelPercent: number;
    remainingFuelLiters:  number;
    range:                number;
}

export interface DoorsState {
    combinedSecurityState: string;
    leftFront:             string;
    leftRear:              string;
    rightFront:            string;
    rightRear:             string;
    combinedState:         string;
    hood:                  string;
    trunk:                 string;
}

export interface DriverPreferences {
    lscPrivacyMode: string;
}

export interface ElectricChargingState {
    chargingLevelPercent:   number;
    range:                  number;
    isChargerConnected:     boolean;
    chargingConnectionType: string;
    chargingStatus:         string;
    chargingTarget:         number;
}

export interface LocationInfo {
    coordinates: Coordinates;
    address:     Address;
    heading:     number;
}

export interface Address {
    formatted: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface RequiredService {
    dateTime:    Date;
    type:        string;
    status:      string;
    description: string;
    mileage?:    number;
}

export interface TireStatuses {
    frontLeft:  TireStatusInfo;
    frontRight: TireStatusInfo;
    rearLeft:   TireStatusInfo;
    rearRight:  TireStatusInfo;
}

export interface TireStatusInfo {
    status: TireStatus;
}

export interface TireStatus {
    currentPressure: number;
    targetPressure:  number;
}

export interface WindowsState {
    leftFront:     string;
    leftRear:      string;
    rightFront:    string;
    rightRear:     string;
    combinedState: string;
}

export interface Capabilities {
    a4aType:                                string;
    climateNow:                             boolean;
    climateFunction:                        string;
    horn:                                   boolean;
    isBmwChargingSupported:                 boolean;
    isCarSharingSupported:                  boolean;
    isChargeNowForBusinessSupported:        boolean;
    isChargingHistorySupported:             boolean;
    isChargingHospitalityEnabled:           boolean;
    isChargingLoudnessEnabled:              boolean;
    isChargingPlanSupported:                boolean;
    isChargingPowerLimitEnabled:            boolean;
    isChargingSettingsEnabled:              boolean;
    isChargingTargetSocEnabled:             boolean;
    isCustomerEsimSupported:                boolean;
    isDataPrivacyEnabled:                   boolean;
    isDCSContractManagementSupported:       boolean;
    isEasyChargeEnabled:                    boolean;
    isMiniChargingSupported:                boolean;
    isEvGoChargingSupported:                boolean;
    isRemoteHistoryDeletionSupported:       boolean;
    isRemoteEngineStartSupported:           boolean;
    isRemoteServicesActivationRequired:     boolean;
    isRemoteServicesBookingRequired:        boolean;
    isScanAndChargeSupported:               boolean;
    lastStateCallState:                     string;
    lights:                                 boolean;
    lock:                                   boolean;
    remote360:                              boolean;
    sendPoi:                                boolean;
    unlock:                                 boolean;
    vehicleFinder:                          boolean;
    vehicleStateSource:                     string;
    isRemoteHistorySupported:               boolean;
    isWifiHotspotServiceSupported:          boolean;
    isNonLscFeatureEnabled:                 boolean;
    isSustainabilitySupported:              boolean;
    isSustainabilityAccumulatedViewEnabled: boolean;
    checkSustainabilityDPP:                 boolean;
    specialThemeSupport:                    any[];
    isRemoteParkingSupported:               boolean;
    remoteChargingCommands:                 RemoteChargingCommands;
    isClimateTimerWeeklyActive:             boolean;
    digitalKey:                             DigitalKey;
}

export interface DigitalKey {
    bookedServicePackage: string;
    state:                string;
}

export interface RemoteChargingCommands {
    chargingControl?:                       string[];
    flapControl?:                           string[];
    plugControl?:                           string[];
}

export interface RemoteServiceRequestResponse {
    eventId: string;
    creationTime: string;
}
