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
    iStep:         IStep | number; // Can be either detailed object or simple number
    seriesCluster: string;
}

export interface IStep {
    seriesCluster: string;
    year:          number;
    month:         number;
    iStep:         number;
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

export interface LoggedInProfile {
    driverFront:     ProfileInfo;
    passengerFront:  ProfileInfo;
}

export interface ProfileInfo {
    gcid?: string;
}

export interface VehicleStatus {
    isLeftSteering:                  boolean;
    lastFetched:                     Date;
    lastUpdatedAt:                   Date;
    isLscSupported:                  boolean;
    range:                           number;
    doorsState:                      DoorsState;
    windowsState:                    WindowsState;
    tireState:                       TireStatuses;
    location:                        LocationInfo;
    currentMileage:                  number;
    climateControlState:             ClimateControlState;
    requiredServices:                RequiredService[];
    checkControlMessages:            CheckControlMessage[];
    chargingProfile:                 ChargingProfile;
    electricChargingState:           ElectricChargingState;
    combustionFuelLevel:             CombustionFuelLevel;
    driverPreferences:               DriverPreferences;
    isDeepSleepModeActive:           boolean;
    climateTimers:                   ClimateTimer[];
    departurePlan:                   any; // Empty object in the JSON data
    securityOverviewMode:            string | null;
    vehicleSoftwareVersion:          SoftwareVersion;
    pwf:                             string;
    loggedInProfile:                 LoggedInProfile;
    isRemoteEngineStartDisclaimer:   boolean;
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
    targetSoc:               number;
    acCurrentLimit?:         number;
    idcc:                    string;
    hospitality:             string;
    isAcCurrentLimitActive?: boolean;
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
    remainingFuelPercent?: number;
    remainingFuelLiters?:  number;
    range:                 number;
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

export interface Battery {
    batteryPreconditionState:      string;
    batteryPreconditionErrorState: string | null;
}

export interface ElectricChargingState {
    chargingLevelPercent:        number;
    remainingChargingMinutes?:   number;
    range:                       number;
    isChargerConnected:          boolean;
    chargingConnectionType?:     string;
    chargingStatus:              string;
    chargingTarget:              number;
    battery?:                    Battery;
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

export interface TireDetails {
    dimension:                 string;
    treadDesign:              string;
    manufacturer:             string;
    manufacturingWeek:        number;
    isOptimizedForOemBmw:     boolean;
    partNumber:               string;
    speedClassification:      TireSpeedClassification;
    mountingDate:             string;
    season:                   number;
    identificationInProgress: boolean;
}

export interface TireSpeedClassification {
    speedRating: number;
    atLeast:     boolean;
}

export interface TireStatusInfo {
    details?: TireDetails;
    status:   TireStatus;
}

export interface TireStatus {
    currentPressure?: number;
    targetPressure:   number;
}

export interface WindowsState {
    leftFront:     string;
    leftRear:      string;
    rightFront:    string;
    rightRear:     string;
    combinedState: string;
}

export interface RemoteService {
    id:           string;
    state:        string;
    executionApi: string;
    functions?:   RemoteServiceFunctions;  // Optional - only present on camera-related services
}

export interface RemoteServiceFunctions {
    encryptionMethod?:       string[];     // Present on all services that have functions
    inCarCameraFunction?:    string[];     // Only present on inCarCamera service
}

export interface RemoteServices {
    departureTimerControl?:          RemoteService;
    inCarCamera?:                    RemoteService;
    inCarCameraDwa?:                 RemoteService;
    remote360?:                      RemoteService;
    surroundViewRecorder?:           RemoteService;
    windowControl?:                  RemoteService;
    centralLockControl?:             RemoteService;
    batteryPreconditioningControl?: RemoteService;
    doorLock?:                       RemoteService;
    doorUnlock?:                     RemoteService;
    hornBlow?:                       RemoteService;
    lightFlash?:                     RemoteService;
    telematicsWakeup?:              RemoteService;
    wakeup?:                         RemoteService;
    interiorPreconditioningControl?: RemoteService;
}

export interface PersonalPictureUpload {
    state:       string;
    aspectRatio: string;
}

export interface ThirdPartyAppStore {
    state: string;
}

export interface LocationBasedCommerceFeatures {
    parking:      boolean;
    fueling:      boolean;
    reservations: boolean;
}

export interface Capabilities {
    remoteServices:                         RemoteServices;
    a4aType:                                string;
    climateNow:                             boolean;
    isClimateTimerWeeklyActive:             boolean;
    climateFunction:                        string;
    horn:                                   boolean;
    inCarCamera?:                           boolean;
    inCarCameraVideo?:                      boolean;
    inCarCameraDwa?:                        boolean;
    isBmwChargingSupported:                 boolean;
    isCarSharingSupported:                  boolean;
    isChargeNowForBusinessSupported:        boolean;
    isChargingHistorySupported:             boolean;
    isLocationBasedChargingSettingsSupported?: boolean;
    isChargingHospitalityEnabled:           boolean;
    isChargingLoudnessEnabled:              boolean;
    isChargingPlanSupported:                boolean;
    isChargingPowerLimitEnabled:            boolean;
    isChargingSettingsEnabled:              boolean;
    isBatteryPreconditioningSupported?:     boolean;
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
    remote360?:                             boolean;
    remoteSoftwareUpgrade?:                 boolean;
    sendPoi:                                boolean;
    surroundViewRecorder?:                  boolean;
    unlock:                                 boolean;
    vehicleFinder:                          boolean;
    vehicleStateSource:                     string;
    isRemoteHistorySupported:               boolean;
    isWifiHotspotServiceSupported:          boolean;
    isNonLscFeatureEnabled:                 boolean;
    isSustainabilitySupported:              boolean;
    isSustainabilityAccumulatedViewEnabled: boolean;
    checkSustainabilityDPP?:                boolean;
    specialThemeSupport:                    any[];
    isRemoteParkingSupported:               boolean;
    isRemoteParkingEes25Active?:            boolean;
    remoteChargingCommands:                 RemoteChargingCommands;
    digitalKey:                             DigitalKey;
    isPersonalPictureUploadSupported?:      boolean;
    personalPictureUpload?:                 PersonalPictureUpload;
    isPlugAndChargeSupported?:              boolean;
    isOptimizedChargingSupported?:          boolean;
    alarmSystem?:                           boolean;
    isThirdPartyAppStoreSupported?:         boolean;
    thirdPartyAppStore?:                    ThirdPartyAppStore;
    thirdPartyAppStoreCn?:                  ThirdPartyAppStore;
    locationBasedCommerceFeatures?:         LocationBasedCommerceFeatures;
}

export interface DigitalKey {
    bookedServicePackage:           string;
    state:                          string;
    readerGraphics?:                string;
    vehicleSoftwareUpgradeRequired?: boolean;
    isDigitalKeyFirstSupported?:    boolean;
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

// Charging Details API Response Interfaces
export interface ChargingDetailsResponse {
    chargeAndClimateSettings:     ChargeAndClimateSettings;
    chargeAndClimateTimerDetail:  ChargeAndClimateTimerDetail;
    chargingFlapDetail?:          ChargingFlapDetail;
    chargingSettingsDetail?:      ChargingSettingsDetail;
    servicePack:                  string;
}

export interface ChargeAndClimateSettings {
    chargeAndClimateTimer:  ChargeAndClimateTimer;
    chargingFlap?:          ChargingFlap;
    chargingSettings?:      ChargingSettingsLabels;
}

export interface ChargeAndClimateTimer {
    chargingMode?:                string;
    chargingModeSemantics?:       string;
    departureTimer?:              string[];
    departureTimerSemantics?:     string;
    preconditionForDeparture?:    string;
    showDepartureTimers:          boolean;
}

export interface ChargingFlap {
    permanentlyUnlockLabel: string;
}

export interface ChargingSettingsLabels {
    acCurrentLimitLabel?:               string;
    acCurrentLimitLabelSemantics?:      string;
    chargingTargetLabel?:               string;
    dcLoudnessLabel?:                   string;
    unlockCableAutomaticallyLabel?:     string;
}

export interface ChargeAndClimateTimerDetail {
    chargingMode:                    ChargingModeDetail;
    departureTimer:                  DepartureTimerDetail;
    isPreconditionForDepartureActive: boolean;
}

export interface ChargingModeDetail {
    chargingPreference: string;
    endTimeSlot:        string;
    startTimeSlot:      string;
    type:               string;
}

export interface DepartureTimerDetail {
    type:          string;
    weeklyTimers:  WeeklyTimer[];
}

export interface WeeklyTimer {
    daysOfTheWeek: string[];
    id:            number;
    time:          string;
    timerAction:   string;
}

export interface ChargingFlapDetail {
    isPermanentlyUnlock: boolean;
}

export interface ChargingSettingsDetail {
    acLimit?:                     AcLimit;
    chargingTarget?:             number;
    dcLoudness?:                 string;
    isUnlockCableActive?:        boolean;
    minChargingTargetToWarning?: number;
    acLimitValue?:               number;
}

export interface AcLimit {
    current:      CurrentLimit;
    isUnlimited:  boolean;
    max:          number;
    min:          number;
    values:       number[];
}

export interface CurrentLimit {
    unit:  string;
    value: number;
}
