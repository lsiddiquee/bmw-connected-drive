export class VehicleStatus {
    unitOfLength!: string;
    remainingRange!: number;
    updateTimeConverted!: Date;
    doorDriverRear!: string;
    doorPassengerRear!: string;
    beRemainingRangeFuelKm!: number;
    doorDriverFront!: string;
    hoodState!: string;
    chargingStatus!: string;
    kombiCurrentRemainingRangeFuel!: number;
    windowDriverRear!: string;
    beRemainingRangeElectricKm!: number;
    mileage!: number;
    unitOfEnergy!: string;
    overallEnergyConsumption!: number;
    beRemainingRangeElectric!: number;
    socHvPercent!: number;
    singleImmediateCharging!: boolean;
    updateTimeConvertedTime!: Date;
    connectorStatus!: string;
    chargingHVStatus!: string;
    chargingLevelHv!: number;
    unitOfCombustionConsumption!: string;
    gpsLat!: number;
    windowDriverFront!: string;
    gpsLng!: number;
    conditionBasedServices!: string;
    windowPassengerFront!: string;
    windowPassengerRear!: string;
    lastChargingEndReason!: string;
    updateTimeConvertedDate!: Date;
    beRemainingRangeFuelMile!: number;
    beRemainingRangeFuel!: number;
    doorPassengerFront!: string;
    beChargingLevelHv!: number;
    updateTimeConvertedTimestamp!: number;
    remainingFuel!: number;
    heading!: number;
    lscTrigger!: string;
    lightsParking!: string;
    doorLockState!: string;
    updateTime!: Date;
    beEnergyLevelHv!: number;
    trunkState!: string;
    batterySizeMax!: number;
    beRemainingRangeElectricMile!: number;
    chargingConnectionType!: string;
    unitOfElectricConsumption!: string;
    lastUpdateReason!: string;

    constructor(response: {
        attributesMap: {
        unitOfLength: string,
        remaining_range: string,
        updateTime_converted: string,
        door_driver_rear: string,
        door_passenger_rear: string,
        beRemainingRangeFuelKm: string,
        door_driver_front: string,
        hood_state: string,
        charging_status: string,
        kombi_current_remaining_range_fuel: string,
        window_driver_rear: string,
        beRemainingRangeElectricKm: string,
        mileage: string,
        unitOfEnergy: string,
        overall_energy_consumption: string,
        beRemainingRangeElectric: string,
        soc_hv_percent: string,
        single_immediate_charging: string,
        updateTime_converted_time: string,
        connectorStatus: string,
        chargingHVStatus: string,
        chargingLevelHv: string,
        unitOfCombustionConsumption: string,
        gps_lat: string,
        window_driver_front: string,
        gps_lng: string,
        condition_based_services: string,
        window_passenger_front: string,
        window_passenger_rear: string,
        lastChargingEndReason: string,
        updateTime_converted_date: string,
        beRemainingRangeFuelMile: string,
        beRemainingRangeFuel: string,
        door_passenger_front: string,
        beChargingLevelHv: string,
        updateTime_converted_timestamp: string,
        remaining_fuel: string,
        heading: string,
        lsc_trigger: string,
        lights_parking: string,
        door_lock_state: string,
        updateTime: string,
        beEnergyLevelHv: string,
        trunk_state: string,
        battery_size_max: string,
        beRemainingRangeElectricMile: string,
        charging_connection_type: string,
        unitOfElectricConsumption: string,
        lastUpdateReason: string
    }}){
        this.unitOfLength = response.attributesMap.unitOfLength;
        this.mileage = parseInt(response.attributesMap.mileage) || 0;
        this.remainingFuel = parseInt(response.attributesMap.remaining_fuel) || 0;
        this.doorLockState = response.attributesMap.door_lock_state;
        this.remainingRange = parseInt(response.attributesMap.remaining_range) || 0;
        this.chargingStatus = response.attributesMap.charging_status;
        this.socHvPercent = parseInt(response.attributesMap.soc_hv_percent) || 0;
        this.chargingLevelHv = parseInt(response.attributesMap.chargingLevelHv) || 0;
        this.beRemainingRangeElectric = parseInt(response.attributesMap.beRemainingRangeElectric) || 0;
        this.beRemainingRangeFuel = this.remainingRange - this.beRemainingRangeElectric;

        this.updateTimeConverted = new Date(response.attributesMap.updateTime_converted);
        this.doorDriverRear = response.attributesMap.door_driver_rear;
        this.doorPassengerRear = response.attributesMap.door_passenger_rear;
        this.beRemainingRangeFuelKm = parseInt(response.attributesMap.beRemainingRangeFuelKm) || 0;
        this.doorDriverFront = response.attributesMap.door_driver_front;
        this.hoodState = response.attributesMap.hood_state;
        this.kombiCurrentRemainingRangeFuel = parseInt(response.attributesMap.kombi_current_remaining_range_fuel) || 0;
        this.windowDriverRear = response.attributesMap.window_driver_rear;
        this.beRemainingRangeElectricKm = parseInt(response.attributesMap.beRemainingRangeElectricKm) || 0;
        this.unitOfEnergy = response.attributesMap.unitOfEnergy;
        this.overallEnergyConsumption = parseFloat(response.attributesMap.overall_energy_consumption) || 0;
        this.singleImmediateCharging = response.attributesMap.single_immediate_charging === "true";
        this.updateTimeConvertedTime = new Date(response.attributesMap.updateTime_converted_time);
        this.connectorStatus = response.attributesMap.connectorStatus;
        this.chargingHVStatus = response.attributesMap.chargingHVStatus;
        this.unitOfCombustionConsumption = response.attributesMap.unitOfCombustionConsumption;
        this.gpsLat = parseFloat(response.attributesMap.gps_lat) || 0;
        this.windowDriverFront = response.attributesMap.window_driver_front;
        this.gpsLng = parseFloat(response.attributesMap.gps_lng) || 0;
        this.conditionBasedServices = response.attributesMap.condition_based_services;
        this.windowPassengerFront = response.attributesMap.window_passenger_front;
        this.windowPassengerRear = response.attributesMap.window_passenger_rear;
        this.lastChargingEndReason = response.attributesMap.lastChargingEndReason;
        this.updateTimeConvertedDate = new Date(response.attributesMap.updateTime_converted_date);
        this.beRemainingRangeFuelMile = parseInt(response.attributesMap.beRemainingRangeFuelMile) || 0;
        this.doorPassengerFront = response.attributesMap.door_passenger_front;
        this.beChargingLevelHv = parseFloat(response.attributesMap.beChargingLevelHv) || 0;
        this.updateTimeConvertedTimestamp = parseInt(response.attributesMap.updateTime_converted_timestamp) || 0;
        this.heading = parseInt(response.attributesMap.heading) || 0;
        this.lscTrigger = response.attributesMap.lsc_trigger;
        this.lightsParking = response.attributesMap.lights_parking;
        this.updateTime = new Date(response.attributesMap.updateTime);
        this.beEnergyLevelHv = parseFloat(response.attributesMap.beEnergyLevelHv) || 0;
        this.trunkState = response.attributesMap.trunk_state;
        this.batterySizeMax = parseFloat(response.attributesMap.battery_size_max) || 0;
        this.beRemainingRangeElectricMile = parseInt(response.attributesMap.beRemainingRangeElectricMile) || 0;
        this.chargingConnectionType = response.attributesMap.charging_connection_type;
        this.unitOfElectricConsumption = response.attributesMap.unitOfElectricConsumption;
        this.lastUpdateReason = response.attributesMap.lastUpdateReason;

        //this.beRemainingRangeFuel
    }
}
