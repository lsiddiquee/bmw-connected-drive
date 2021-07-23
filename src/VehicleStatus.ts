export class VehicleStatus {
    unitOfLength?: string;
    remainingRange?: number;
    updateTimeConverted?: Date;
    doorDriverRear?: string;
    doorPassengerRear?: string;
    beRemainingRangeFuelKm?: number;
    doorDriverFront?: string;
    hoodState?: string;
    chargingStatus?: string;
    kombiCurrentRemainingRangeFuel?: number;
    windowDriverRear?: string;
    beRemainingRangeElectricKm?: number;
    mileage?: number;
    unitOfEnergy?: string;
    overallEnergyConsumption?: number;
    beRemainingRangeElectric?: number;
    socHvPercent?: number;
    singleImmediateCharging?: boolean;
    updateTimeConvertedTime?: Date;
    connectorStatus?: string;
    chargingHVStatus?: string;
    chargingLevelHv?: number;
    unitOfCombustionConsumption?: string;
    gpsLat?: number;
    windowDriverFront?: string;
    gpsLng?: number;
    conditionBasedServices?: string;
    windowPassengerFront?: string;
    windowPassengerRear?: string;
    lastChargingEndReason?: string;
    updateTimeConvertedDate?: Date;
    beRemainingRangeFuelMile?: number;
    beRemainingRangeFuel?: number;
    doorPassengerFront?: string;
    beChargingLevelHv?: number;
    updateTimeConvertedTimestamp?: number;
    remainingFuel?: number;
    heading?: number;
    lscTrigger?: string;
    lightsParking?: string;
    doorLockState?: string;
    updateTime?: Date;
    beEnergyLevelHv?: number;
    trunkState?: string;
    batterySizeMax?: number;
    beRemainingRangeElectricMile?: number;
    chargingConnectionType?: string;
    unitOfElectricConsumption?: string;
    lastUpdateReason?: string;

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
        }
    }) {
        this.unitOfLength = response.attributesMap.unitOfLength;
        this.mileage = this.toInteger(response.attributesMap.mileage);
        this.remainingFuel = this.toInteger(response.attributesMap.remaining_fuel);
        this.doorLockState = response.attributesMap.door_lock_state;
        this.remainingRange = this.toInteger(response.attributesMap.remaining_range);
        this.chargingStatus = response.attributesMap.charging_status;
        this.socHvPercent = this.toInteger(response.attributesMap.soc_hv_percent);
        this.chargingLevelHv = this.toInteger(response.attributesMap.chargingLevelHv);
        this.beRemainingRangeElectric = this.toInteger(response.attributesMap.beRemainingRangeElectric);

        // The remaining fuel range should be calculated as PHEV/BEV returns full range not fuel only.
        this.beRemainingRangeFuel = this.remainingRange;
        if (!isNaN(this.remainingRange!) && !isNaN(this.beRemainingRangeElectric!)) {
            this.beRemainingRangeFuel! -= this.beRemainingRangeElectric!;
        }
        this.kombiCurrentRemainingRangeFuel = this.beRemainingRangeFuel;
        // this.beRemainingRangeFuelKm = this.toInteger(response.attributesMap.beRemainingRangeFuelKm);
        // this.beRemainingRangeFuelMile = this.toInteger(response.attributesMap.beRemainingRangeFuelMile);

        this.updateTimeConverted = response.attributesMap.updateTime_converted ? new Date(response.attributesMap.updateTime_converted) : undefined;
        this.doorDriverRear = response.attributesMap.door_driver_rear;
        this.doorPassengerRear = response.attributesMap.door_passenger_rear;
        this.doorDriverFront = response.attributesMap.door_driver_front;
        this.hoodState = response.attributesMap.hood_state;
        this.windowDriverRear = response.attributesMap.window_driver_rear;
        this.beRemainingRangeElectricKm = this.toInteger(response.attributesMap.beRemainingRangeElectricKm);
        this.unitOfEnergy = response.attributesMap.unitOfEnergy;
        this.overallEnergyConsumption = this.toFloat(response.attributesMap.overall_energy_consumption);
        this.singleImmediateCharging = response.attributesMap.single_immediate_charging ? response.attributesMap.single_immediate_charging === "true" : undefined;
        this.updateTimeConvertedTime = response.attributesMap.updateTime_converted_time ? new Date(response.attributesMap.updateTime_converted_time) : undefined;
        this.connectorStatus = response.attributesMap.connectorStatus;
        this.chargingHVStatus = response.attributesMap.chargingHVStatus;
        this.unitOfCombustionConsumption = response.attributesMap.unitOfCombustionConsumption;
        this.gpsLat = this.toFloat(response.attributesMap.gps_lat);
        this.windowDriverFront = response.attributesMap.window_driver_front;
        this.gpsLng = this.toFloat(response.attributesMap.gps_lng);
        this.conditionBasedServices = response.attributesMap.condition_based_services;
        this.windowPassengerFront = response.attributesMap.window_passenger_front;
        this.windowPassengerRear = response.attributesMap.window_passenger_rear;
        this.lastChargingEndReason = response.attributesMap.lastChargingEndReason;
        this.updateTimeConvertedDate = response.attributesMap.updateTime_converted_date ? new Date(response.attributesMap.updateTime_converted_date) : undefined;
        this.doorPassengerFront = response.attributesMap.door_passenger_front;
        this.beChargingLevelHv = this.toFloat(response.attributesMap.beChargingLevelHv);
        this.updateTimeConvertedTimestamp = this.toInteger(response.attributesMap.updateTime_converted_timestamp);
        this.heading = this.toInteger(response.attributesMap.heading);
        this.lscTrigger = response.attributesMap.lsc_trigger;
        this.lightsParking = response.attributesMap.lights_parking;
        this.updateTime = response.attributesMap.updateTime ? new Date(response.attributesMap.updateTime) : undefined;
        this.beEnergyLevelHv = this.toFloat(response.attributesMap.beEnergyLevelHv);
        this.trunkState = response.attributesMap.trunk_state;
        this.batterySizeMax = this.toFloat(response.attributesMap.battery_size_max);
        this.beRemainingRangeElectricMile = this.toInteger(response.attributesMap.beRemainingRangeElectricMile);
        this.chargingConnectionType = response.attributesMap.charging_connection_type;
        this.unitOfElectricConsumption = response.attributesMap.unitOfElectricConsumption;
        this.lastUpdateReason = response.attributesMap.lastUpdateReason;
    }

    toInteger(string: string) : number | undefined {
        const value = parseInt(string);
        return isNaN(value) ? undefined : value;
    }

    toFloat(string: string) : number | undefined {
        const value = parseFloat(string);
        return isNaN(value) ? undefined : value;
    }
}
