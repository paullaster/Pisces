import { PricingMatrix } from "../../../app/providers/pricingMatrixProvider.js";
import pricingMatrix from "../../../config/pricing.matrix.js";

export class MapService {
    constructor (serviceProvider, ) {
        this.serviceProvider = serviceProvider;
        this.durationDistanceMatrix = this.durationDistanceMatrix.bind(this);
        this.reverseGeocoding = this.reverseGeocoding.bind(this);
    }
    async durationDistanceMatrix(sourceCordinates, destinationCordinates, options = {}) {
        try {
            const { MAPBOX, GOOGLE } = this.serviceProvider.MAP_SERVICE;
        if (this.serviceProvider.MAP_SERVICE_TYPE === 'MAPBOX') {
            const {success:s, data, error} = await this.serviceProvider.fetch.Mapbox.distanceMatrix(sourceCordinates, destinationCordinates, MAPBOX, options);
            if (!s) {
                return { s, error };
            }
            const distance = Math.max(data.distances[0][1], data.distances[1][0]);
            const duration = Math.max(data.durations[0][1], data.durations[1][0]);
            const priceMatrix = new PricingMatrix();
            const { success, error:r, data:price } = priceMatrix.pricingAlgorithm(distance, duration, pricingMatrix);
            if (!success) {
                return { success, r };
            }
            return { success, data: {distance, duration, price} };
        } else if (this.serviceProvider.MAP_SERVICE_TYPE === 'GOOGLE') {
            const {success:s, data, error} = await this.serviceProvider.fetch.Google.distanceMatrix(sourceCordinates, destinationCordinates, GOOGLE, options);
            if (!s) {
                return { s, error };
            }
            const distance = Math.max(data.distances[0][1], data.distances[1][0]);
            const duration = Math.max(data.durations[0][1], data.durations[1][0]);
            const priceMatrix = new PricingMatrix();
            const { success, error:r, data:price } = priceMatrix.pricingAlgorithm(distance, duration, pricingMatrix);
            if (!success) {
                return { success, r };
            }
            
            return { success, data: {distance, duration, price} };
        } else {
            return {error:'Invalid map service type', success: false};
        }
        } catch (error) {
            console.log(error);
            return {error: error.message, success: false};
        }
    }
    async reverseGeocoding (longitude, latitude, options = {}) {
        try {
            const { MAPBOX } = this.serviceProvider.MAP_SERVICE;
            if (this.serviceProvider.MAP_SERVICE_TYPE === 'MAPBOX') {
                const {success, data, error} = await this.serviceProvider.fetch.Mapbox.reverseGeocoding(longitude, latitude, MAPBOX, options);
                if (!success) {
                    return { success, error };
                }
                return { success, data: data.features[0] };
            }
        } catch (error) {
            return { success: false, error: error.message}
        }
    }
}