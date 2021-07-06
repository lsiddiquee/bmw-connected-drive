import { Regions } from "./Regions"

type EndpointMap = { [P in Regions]: string }

export class Constants {
    static readonly OAuthEndpoints: EndpointMap = {
        NorthAmerica: "b2vapi.bmwgroup.us/gcdm",
        RestOfWorld: "customer.bmwgroup.com/gcdm",
        China: "customer.bmwgroup.cn/gcdm"
    }

    static readonly ServerEndpoints: EndpointMap = {
        NorthAmerica: "b2vapi.bmwgroup.us",
        RestOfWorld: "b2vapi.bmwgroup.com",
        China: "b2vapi.bmwgroup.cn:8592"
    }

    static readonly OAuthAuthorization: EndpointMap = {
        NorthAmerica: "ZDc2NmI1MzctYTY1NC00Y2JkLWEzZGMtMGNhNTY3MmQ3ZjhkOjE1ZjY5N2Y2LWE1ZDUtNGNhZC05OWQ5LTNhMTViYzdmMzk3Mw==",
        RestOfWorld: "ZDc2NmI1MzctYTY1NC00Y2JkLWEzZGMtMGNhNTY3MmQ3ZjhkOjE1ZjY5N2Y2LWE1ZDUtNGNhZC05OWQ5LTNhMTViYzdmMzk3Mw==",
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
