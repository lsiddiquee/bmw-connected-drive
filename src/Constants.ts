import { CarBrand } from "./CarBrand";
import { Regions } from "./Regions"

type EndpointMap = { [P in Regions]: string }

export class Constants {
    static readonly ServerEndpoints: EndpointMap = {
        NorthAmerica: "cocoapi.bmwgroup.us",
        RestOfWorld: "cocoapi.bmwgroup.com",
        China: "myprofile.bmw.com.cn"
    }

    static readonly ApimSubscriptionKey: EndpointMap = {
        NorthAmerica: "31e102f5-6f7e-7ef3-9044-ddce63891362",
        RestOfWorld: "4f1c85a3-758f-a37d-bbb6-f8704494acfa",
        China: "blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg=="
    }

    static readonly AppVersions: EndpointMap = {
        NorthAmerica: "4.9.2(36892)",
        RestOfWorld: "4.9.2(36892)",
        China: "4.9.2(36892)",
    }

    static readonly RegionCodes: EndpointMap = {
        NorthAmerica: "na",
        RestOfWorld: "row",
        China: "cn",
    }

    static readonly User_Agent: string = "Dart/3.3 (dart:io)";
    static X_User_Agent = (build_string: string, region: Regions, brand: CarBrand = CarBrand.Bmw) => `android(${build_string});${brand.toLowerCase()};${this.AppVersions[region]};${this.RegionCodes[region]}`;        
    
    static readonly getVehicles: string = "/eadrax-vcs/v4/vehicles";
    static readonly remoteServicesBaseUrl: string = "/eadrax-vrccs/v3/presentation/remote-commands";
    static readonly executeRemoteServices: string =  Constants.remoteServicesBaseUrl + "/{vehicleVin}/{serviceType}";
    static readonly statusRemoteServices: string = Constants.remoteServicesBaseUrl + "/eventStatus?eventId={eventId}";
    static readonly statusRemoteServicePostion: string = Constants.remoteServicesBaseUrl + "/eventPosition?eventId={eventId}";
    static readonly getImages: string = "/eadrax-ics/v5/presentation/vehicles/images?carView={carView}&toCrop=true";

    static readonly vehicleChargingDetailsUrl = "/eadrax-crccs/v2/vehicles";
    static readonly vehicleChargingBaseUrl = "/eadrax-crccs/v1/vehicles/{vehicleVin}";
    static readonly vehicleChargingSettingsSetUrl = Constants.vehicleChargingBaseUrl + "/charging-settings";
    static readonly vehicleChargingProfileSetUrl = Constants.vehicleChargingBaseUrl + "/charging-profile";
    static readonly vehicleChargingStartStopUrl = Constants.vehicleChargingBaseUrl + "/{serviceType}";
}
