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
        updateTime_converted: Date,
        door_driver_rear: string,
        door_passenger_rear: string,
        beRemainingRangeFuelKm: number,
        door_driver_front: string,
        hood_state: string,
        charging_status: string,
        kombi_current_remaining_range_fuel: number,
        window_driver_rear: string,
        beRemainingRangeElectricKm: number,
        mileage: string,
        unitOfEnergy: string,
        overall_energy_consumption: number,
        beRemainingRangeElectric: string,
        soc_hv_percent: string,
        single_immediate_charging: boolean,
        updateTime_converted_time: Date,
        connectorStatus: string,
        chargingHVStatus: string,
        chargingLevelHv: string,
        unitOfCombustionConsumption: string,
        gps_lat: number,
        window_driver_front: string,
        gps_lng: number,
        condition_based_services: string,
        window_passenger_front: string,
        window_passenger_rear: string,
        lastChargingEndReason: string,
        updateTime_converted_date: Date,
        beRemainingRangeFuelMile: number,
        beRemainingRangeFuel: string,
        door_passenger_front: string,
        beChargingLevelHv: number,
        updateTime_converted_timestamp: number,
        remaining_fuel: number,
        heading: number,
        lsc_trigger: string,
        lights_parking: string,
        door_lock_state: string,
        updateTime: Date,
        beEnergyLevelHv: number,
        trunk_state: string,
        battery_size_max: number,
        beRemainingRangeElectricMile: number,
        charging_connection_type: string,
        unitOfElectricConsumption: string,
        lastUpdateReason: string
    }}){
        this.unitOfLength = response.attributesMap.unitOfLength;
        this.mileage = parseInt(response.attributesMap.mileage) || 0;
        this.doorLockState = response.attributesMap.door_lock_state;
        this.remainingRange = parseInt(response.attributesMap.remaining_range) || 0;
        this.chargingStatus = response.attributesMap.charging_status;
        this.socHvPercent = parseInt(response.attributesMap.soc_hv_percent) || 0;
        this.chargingLevelHv = parseInt(response.attributesMap.chargingLevelHv) || 0;
        this.beRemainingRangeElectric = parseInt(response.attributesMap.beRemainingRangeElectric) || 0;
        this.beRemainingRangeFuel = this.remainingRange - this.beRemainingRangeElectric;
    }
}
