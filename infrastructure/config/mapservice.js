import { Client } from "@googlemaps/google-maps-services-js";

export default {
    MAP_SERVICE: process.env.MAP_SERVICE || 'MAPBOX',
    MAPBOX: {
        apiKey: process.env.MAPBOX_SERVICE_API_KEY,
        mapStyle: process.env.MAPBOX_SERVICE_STYLE,
        defaultZoom: parseInt(String(process.env.MAPBOX_SERVICE_DEFAULT_ZOOM)),
        defaultCenter: {},
        defaultMarker: {},
        defaultMarkerIcon: {},
        defaultMarkerPopup: {},
        defaultMarkerAnimation: "",
        mapServiceURL: process.env.MAPBOX_SERVICE_URL || "https://api.mapbox.com",
        matrixAPIProfile: process.env.MAPBOX_MATRIX_API_PROFILE || "mapbox/driving",
    },
    GOOGLE: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
        mapStyle: process.env.GOOGLE_MAPS_STYLE,
        defaultZoom: parseInt(String(process.env.GOOGLE_MAPS_DEFAULT_ZOOM)),
        defaultCenter: {},
        defaultMarker: {},
        defaultMarkerIcon: {},
        defaultMarkerPopup: {},
        defaultMarkerAnimation: "",
        mapServiceURL: process.env.GOOGLE_MAPS_URL || "https://maps.googleapis.com",
        googleMapClient: new Client({}),
    }
}