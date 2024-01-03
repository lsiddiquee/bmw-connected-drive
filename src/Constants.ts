import { Regions } from "./Regions"

type EndpointMap = { [P in Regions]: string }

export class Constants {
    static readonly ServerEndpoints: EndpointMap = {
        NorthAmerica: "cocoapi.bmwgroup.us",
        RestOfWorld: "cocoapi.bmwgroup.com",
        China: "myprofile.bmw.com.cn"
    }

    static readonly OAuthAuthorizationKey: EndpointMap = {
        NorthAmerica: "31e102f5-6f7e-7ef3-9044-ddce63891362",
        RestOfWorld: "4f1c85a3-758f-a37d-bbb6-f8704494acfa",
        China: "blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg=="
    }

    static readonly User_Agent: string = "Dart/2.19 (dart:io)";
    static readonly X_User_Agent: EndpointMap = {
        NorthAmerica: "android(TQ2A.230405.003.B2);bmw;3.9.0(27760);na",
        RestOfWorld: "android(TQ2A.230405.003.B2);bmw;3.9.0(27760);row",
        China: "android(TQ2A.230405.003.B2);bmw;3.6.1(23634);cn"
    }

    static readonly getVehicles: string = "/eadrax-vcs/v4/vehicles";
    static readonly remoteServicesBaseUrl: string = "/eadrax-vrccs/v2/presentation/remote-commands";
    static readonly executeRemoteServices: string =  Constants.remoteServicesBaseUrl + "/{vehicleVin}/{serviceType}";
    static readonly statusRemoteServices: string = Constants.remoteServicesBaseUrl + "/eventStatus?eventId={eventId}";
    static readonly statusRemoteServicePostion: string = Constants.remoteServicesBaseUrl + "/eventPosition?eventId={eventId}";

    static readonly vehicleChargingDetailsUrl = "/eadrax-crccs/v2/vehicles";
    static readonly vehicleChargingBaseUrl = "/eadrax-crccs/v1/vehicles/{vehicleVin}";
    static readonly vehicleChargingSettingsSetUrl = Constants.vehicleChargingBaseUrl + "/charging-settings";
    static readonly vehicleChargingProfileSetUrl = Constants.vehicleChargingBaseUrl + "/charging-profile";
    static readonly vehicleChargingStartStopUrl = Constants.vehicleChargingBaseUrl + "/{serviceType}";
}
