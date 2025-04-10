import mapservice from "../../config/mapservice.js";
import axios from "axios";
import { Client } from "@googlemaps/google-maps-services-js";

export class MapServiceProvider {
    constructor(provider, service) {
        this.MAP_SERVICE_TYPE = provider;
        this.MAP_SERVICE = service;
        this.fetch = this.fetch;
        this.url = mapservice[this.MAP_SERVICE_TYPE].mapServiceURL

    }
    fetch = {
        Mapbox: {
            distanceMatrix: async (sourceCordinates, destinationCordinates, service, options = {}) => {
                try {
                    const coordinates = `${sourceCordinates};${destinationCordinates};${sourceCordinates}`;
                    const response = await axios.request({
                        method: 'GET',
                        url: `${this.url}/directions-matrix/v1/${service.matrixAPIProfile}/${coordinates}`,
                        params: {
                            ...options,
                            access_token: service.apiKey,
                        }
                    });
                    if (response.data.code === "Ok") {
                        return { success: true, data: response.data };
                    } else {
                        return { success: false, data: response.data };
                    }
                } catch (error) {
                    console.log(error);
                    return { success: false, error: error?.response?.data?.message || error.message || "Error fetching distance matrix" };
                }
            },
            reverseGeocoding: async (long, lat, service, options = {}) => {
                try {
                    const response = await axios.request({
                        method: 'GET',
                        url: `${this.url}/search/geocode/v6/reverse`,
                        params: {
                            longitude: long,
                            latitude: lat,
                            ...options,
                            access_token: service.apiKey,
                        }
                    });
                    if (response.statusText === 'OK') {
                        return { success: true, data: response.data };
                    }
                    return { success: false, data: response.data };
                } catch (error) {
                    return { success: false, error: error.response.data.message || error.message || "Error from geocoding service" };
                }
            },
            forwardGeocoding: async (q, service, options = {}) => {
                try {
                    const response = await axios.request({
                        method: 'GET',
                        url: `${this.url}/search/geocode/v6/forward`,
                        params: {
                            q,
                            ...options,
                            access_token: service.apiKey,
                        }
                    });
                    if (response.statusText === 'OK') {
                        return { success: true, data: response.data };
                    }
                    return { success: false, data: response.data };
                } catch (error) {
                    return { success: false, error: error.message || "Error from geocoding service" }
                }
            }
        },
        Google: {
            distanceMatrix: async (sourceCordinates, destinationCordinates, service, options) => {
                // Fetch distance matrix from Google Maps API
            },
            forwardGeocoding: async (address, service, options = {}) => {
                try {
                    console.log(`forwardGeocoding`, { address, service, options })
                    const client = new Client({});
                    const axiosInstance = axios.create();
                    const gcResult = await client.geocode(
                        {
                            params: {
                                key: service.apiKey,
                                address: address,
                                ...options,
                            },
                            timeout: 60000,
                        }, axiosInstance
                    );
                    console.log("Log here", gcResult);
                    // .then( (gcResult) => {
                    //     console.log("Response from google",gcResult);
                    //     if (gcResult.data.status === 'OK') {
                    //         return { success: true, data: gcResult.data };
                    //     } else {
                    //         return { success: false, data: gcResult.data };
                    //     }
                    // })
                    // .catch( (error) => {
                    //     return { success: false, error: error.message || "Google Maps API error"};
                    // });
                } catch (error) {
                    console.log("Big error", error);
                    return { success: false, error: error.message || "Google Maps API error" }
                }
            },
            reverseGeocoding: async (lng, lat, service, options = {}) => {
                try {
                    const response = service.googleMapClient.reverseGeocode({
                        params: {
                            latlng: {
                                lat,
                                lng,
                            },
                            ...options,
                            key: service.apiKey,
                            enable_address_descriptor: true
                        },
                    })
                    console.log('request got here!', response)
                    if (response.statusText === 'OK') {
                        return { success: true, data: response.data };
                    }
                    return { success: false, data: response.data };
                } catch (error) {
                    console.log(error)
                    return { success: false, error: error.response.data.message || error.message || "Error from geocoding service" };
                }
            },
        },
    }
}