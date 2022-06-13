export interface LastStateCall {
    isNonLscFeatureEnabled: boolean;
    lscState: string;
}

export interface ExecutionPopup {
    executionMessage: string;
    popupType: string;
    title: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    iconId: number;
}

export interface ExecutionStopPopup {
    executionMessage: string;
    title: string;
}

export interface CapabilityInfo {
    isEnabled: boolean;
    isPinAuthenticationRequired: boolean;
    executionMessage: string;
    executionPopup: ExecutionPopup;
    executionStopPopup: ExecutionStopPopup;
}

export interface Remote360 {
    isEnabled: boolean;
    isToggleEnabled: boolean;
    isComingSoonEnabled: boolean;
    isPinAuthenticationRequired: boolean;
    isDataPrivacyEnabled: boolean;
}

export interface Capabilities {
    isRemoteServicesBookingRequired: boolean;
    isRemoteServicesActivationRequired: boolean;
    lock: CapabilityInfo;
    unlock: CapabilityInfo;
    lights: CapabilityInfo;
    horn: CapabilityInfo;
    vehicleFinder: CapabilityInfo;
    sendPoi: CapabilityInfo;
    lastStateCall: LastStateCall;
    climateNow: CapabilityInfo;
    isRemoteHistorySupported: boolean;
    canRemoteHistoryBeDeleted: boolean;
    remote360: Remote360;
    isChargingHistorySupported: boolean;
    isScanAndChargeSupported: boolean;
    isDCSContractManagementSupported: boolean;
    isBmwChargingSupported: boolean;
    isMiniChargingSupported: boolean;
    isChargeNowForBusinessSupported: boolean;
    isDataPrivacyEnabled: boolean;
    isChargingPlanSupported: boolean;
    isChargingPowerLimitEnable: boolean;
    isChargingTargetSocEnable: boolean;
    isChargingLoudnessEnable: boolean;
    isChargingSettingsEnabled: boolean;
    isChargingHospitalityEnabled: boolean;
    isEvGoChargingSupported: boolean;
    isFindChargingEnabled: boolean;
    isCustomerEsimSupported: boolean;
    isCarSharingSupported: boolean;
    isEasyChargeSupported: boolean;
    isSustainabilitySupported: boolean;
    specialThemeSupport: any[];
    isRemoteParkingSupported: boolean;
}

export interface Doors {
    driverFront: string;
    driverRear: string;
    passengerFront: string;
    passengerRear: string;
}

export interface Windows {
    driverFront: string;
    driverRear: string;
    passengerFront: string;
    passengerRear: string;
}

export interface DoorsAndWindows {
    doors: Doors;
    windows: Windows;
    trunk: string;
    hood: string;
}

export interface TireStatusInfo {
    currentPressure: number;
    localizedCurrentPressure: string;
    targetPressure: number;
    localizedTargetPressure: string;
}

export interface TireStatus {
    status: TireStatusInfo;
}

export interface Tires {
    frontLeft: TireStatus;
    frontRight: TireStatus;
    rearLeft: TireStatus;
    rearRight: TireStatus;
}

export interface FuelLevel {
    value: number;
    units: string;
}

export interface FuelPercentage {
    value: number;
}

export interface ChargingState {
    chargePercentage: number;
    state: string;
    type: string;
    isChargerConnected: boolean;
}

export interface Distance {
    value: number;
    units: string;
}

export interface CombustionRange {
    distance: Distance;
}

export interface CombinedRange {
    distance: Distance;
}

export interface ElectricRange {
    distance: Distance;
}

export interface ElectricRangeAndStatus {
    chargePercentage: number;
    distance: Distance;
}

export interface ServiceRequired {
    type: string;
    status: string;
    dateTime: Date;
    distance: Distance;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Address {
    formatted: string;
}

export interface VehicleLocation {
    coordinates: Coordinates;
    address: Address;
    heading: number;
}

export interface ClimateControl {
    activity: string;
}

export interface Properties {
    lastUpdatedAt: Date;
    inMotion: boolean;
    areDoorsLocked: boolean;
    originCountryISO: string;
    areDoorsClosed: boolean;
    areDoorsOpen: boolean;
    areWindowsClosed: boolean;
    doorsAndWindows: DoorsAndWindows;
    tires: Tires;
    isServiceRequired: boolean;
    fuelLevel: FuelLevel;
    fuelPercentage: FuelPercentage;
    chargingState: ChargingState;
    combustionRange: CombustionRange;
    combinedRange: CombinedRange;
    electricRange: ElectricRange;
    electricRangeAndStatus: ElectricRangeAndStatus;
    checkControlMessages: any[];
    serviceRequired: ServiceRequired[];
    vehicleLocation: VehicleLocation;
    climateControl: ClimateControl;
}

export interface DriverGuideInfo {
    title: string;
    androidAppScheme: string;
    iosAppScheme: string;
    androidStoreUrl: string;
    iosStoreUrl: string;
}

export interface VehicleStatusBackgroundColor {
    red: number;
    green: number;
    blue: number;
}

export interface ThemeSpecs {
    vehicleStatusBackgroundColor: VehicleStatusBackgroundColor;
}

export interface CurrentMileage {
    mileage: number;
    units: string;
    formattedMileage: string;
}

export interface Issues {
}

export interface DoorsAndWindow {
    iconId: number;
    title: string;
    state: string;
    criticalness: string;
}

export interface CheckControlMessage {
    criticalness: string;
    iconId: number;
    title: string;
    state: string;
}

export interface RequiredService {
    id: string;
    title: string;
    iconId: number;
    longDescription: string;
    subtitle: string;
    criticalness: string;
}

export interface FuelIndicator {
    mainBarValue: number;
    secondaryBarValue: number;
    infoIconId: number;
    infoLabel: string;
    rangeIconId: number;
    rangeUnits: string;
    levelIconId?: number;
    showsBar: boolean;
    levelUnits: string;
    levelValue: string;
    isInaccurate: boolean;
    isCircleIcon: boolean;
    iconOpacity: string;
    chargingType?: any;
    rangeValue: string;
    showBarGoal?: boolean;
    barType?: any;
    chargingStatusType: string;
    chargingStatusIndicatorType: string;
}

export interface TimeStamp {
    hour: number;
    minute: number;
}

export interface ReductionOfChargeCurrent {
    start: TimeStamp;
    end: TimeStamp;
}

export interface DepartureTime {
    id: number;
    action: string;
    timerWeekDays: string[];
    timeStamp: TimeStamp;
}

export interface ChargingSettings {
    targetSoc: number;
    isAcCurrentLimitActive: boolean;
    hospitality: string;
    idcc: string;
}

export interface ChargingProfile {
    reductionOfChargeCurrent: ReductionOfChargeCurrent;
    chargingMode: string;
    chargingPreference: string;
    chargingControlType: string;
    departureTimes: DepartureTime[];
    climatisationOn: boolean;
    chargingSettings: ChargingSettings;
}

export interface Status {
    lastUpdatedAt: Date;
    currentMileage: CurrentMileage;
    issues: Issues;
    doorsGeneralState: string;
    checkControlMessagesGeneralState: string;
    doorsAndWindows: DoorsAndWindow[];
    checkControlMessages: CheckControlMessage[];
    requiredServices: RequiredService[];
    recallMessages: any[];
    recallExternalUrl?: any;
    fuelIndicators: FuelIndicator[];
    timestampMessage: string;
    chargingProfile: ChargingProfile;
}

export interface Vehicle {
    vin: string;
    model: string;
    year: number;
    brand: string;
    headUnit: string;
    isLscSupported: boolean;
    driveTrain: string;
    puStep: string;
    iStep: string;
    telematicsUnit: string;
    hmiVersion: string;
    bodyType: string;
    a4aType: string;
    capabilities: Capabilities;
    connectedDriveServices: string[];
    properties: Properties;
    isMappingPending: boolean;
    isMappingUnconfirmed: boolean;
    driverGuideInfo: DriverGuideInfo;
    themeSpecs: ThemeSpecs;
    status: Status;
    exFactoryPUStep: string;
    exFactoryILevel: string;
    euiccid: string;
}

export interface RemoteServiceRequestResponse {
    eventId: string;
    creationTime: string;
}
