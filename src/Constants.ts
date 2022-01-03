import { Regions } from "./Regions"

type EndpointMap = { [P in Regions]: string }

export class Constants {
    static readonly LegacyServerEndpoints: EndpointMap = {
        NorthAmerica: "b2vapi.bmwgroup.us",
        RestOfWorld: "b2vapi.bmwgroup.com",
        China: "b2vapi.bmwgroup.cn:8592"
    }

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

    static readonly getVehicles: string = "/webapi/v1/user/vehicles";
    static readonly getVehicleStatus: string = "/api/vehicle/dynamic/v1/{vehicleVin}";
    static readonly executeRemoteServices: string = "/remoteservices/rsapi/v1/{vehicleVin}/{serviceType}";
    static readonly statusRemoteServices: string = "/remoteservices/rsapi/v1/{vehicleVin}/state/execution";
    static readonly sendMessage: string = "/api/vehicle/myinfo/v1/send";

    static readonly getRemoteServices: string = "/api/vehicle/service/v1/{vehicleVin}";
    static readonly vehicleRelationships: string = "/api/me/mapping/v4/status?brand=BM";
}
