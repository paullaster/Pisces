import mapservice from "../../config/mapservice.js";
import axios from "axios";

export class MapServiceProvider {
    constructor (provider, service) {
        this.MAP_SERVICE_TYPE = provider;
        this.MAP_SERVICE = service;
        this.fetch = this.fetch;
        this.url = mapservice[this.MAP_SERVICE_TYPE].mapServiceURL

    }
    fetch = {
        Mapbox: {
            distanceMatrix: async (sourceCordinates, destinationCordinates, MAPBOX, options = {}) => {
                try {
                    const coordinates = `${sourceCordinates};${destinationCordinates};${sourceCordinates}`;
                    const response = await axios.request({
                        method: 'GET',
                        url: `${this.url}/directions-matrix/v1/${MAPBOX.matrixAPIProfile}/${coordinates}`,
                        params: {
                            ...options,
                            access_token: MAPBOX.apiKey,
                        }
                    });
                    if (response.data.code === "Ok") {
                        return { success: true, data: response.data };
                    } else {
                        return { success: false, data: response.data };
                    } 
                } catch (error) {
                    console.log(error);
                    return { success: false, error: error?.response?.data?.message || error.message || "Error fetching distance matrix"};
                }
            },
            reverseGeocoding: async (long, lat, options = {}) => {
                try {
                    const response = await  axios.request({
                        method: 'GET',
                        url: ``,
                        params: {
                            longitude: long,
                            latitude: lat,
                            ...options,
                            access_token: GOOGLE.apiKey,
                        }
                    });
                } catch (error) {
                    return { success: false, error: error.response.data.message || error.message || "Error from geocoding serveice" };
                }
            }
        },
        Google: {
            distanceMatrix: async (sourceCordinates, destinationCordinates, GOOGLE, options) => {
                // Fetch distance matrix from Google Maps API
            }
        }
    }
}