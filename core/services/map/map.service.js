import { PricingMatrix } from "../../../app/providers/pricingMatrixProvider.js";
import pricingMatrix from "../../../config/pricing.matrix.js";

export class MapService {
    constructor(serviceProvider,) {
        this.serviceProvider = serviceProvider;
        this.durationDistanceMatrix = this.durationDistanceMatrix.bind(this);
        this.reverseGeocoding = this.reverseGeocoding.bind(this);
        this.forwardGeocoding = this.forwardGeocoding.bind(this);
    }
    async durationDistanceMatrix(sourceCordinates, destinationCordinates, options = {}) {
        try {
            if (this.serviceProvider.MAP_SERVICE_TYPE === 'MAPBOX') {
                const { success: s, data, error } = await this.serviceProvider.fetch.Mapbox.distanceMatrix(
                    sourceCordinates,
                    destinationCordinates,
                    this.serviceProvider.MAP_SERVICE,
                    options
                );
                if (!s) {
                    return { s, error };
                }
                const distance = Math.max(data.distances[0][1], data.distances[1][0]);
                const duration = Math.max(data.durations[0][1], data.durations[1][0]);
                const priceMatrix = new PricingMatrix();
                const { success, error: r, data: price } = priceMatrix.pricingAlgorithm(distance, duration, pricingMatrix);
                if (!success) {
                    return { success, r };
                }
                return { success, data: { distance, duration, price } };
            } else if (this.serviceProvider.MAP_SERVICE_TYPE === 'GOOGLE') {
                const { success: s, data, error } = await this.serviceProvider.fetch.Google.distanceMatrix(
                    sourceCordinates,
                    destinationCordinates,
                    this.serviceProvider.MAP_SERVICE_TYPE,
                    options
                );
                if (!s) {
                    return { s, error };
                }
                const distance = Math.max(data.distances[0][1], data.distances[1][0]);
                const duration = Math.max(data.durations[0][1], data.durations[1][0]);
                const priceMatrix = new PricingMatrix();
                const { success, error: r, data: price } = priceMatrix.pricingAlgorithm(distance, duration, pricingMatrix);
                if (!success) {
                    return { success, r };
                }

                return { success, data: { distance, duration, price } };
            } else {
                return { error: 'Invalid map service type', success: false };
            }
        } catch (error) {
            console.log(error);
            return { error: error.message, success: false };
        }
    }
    /**
     * @param {any} longitude
     * @param {any} latitude
     */
    async reverseGeocoding(longitude, latitude, options = {}) {
        try {
            if (this.serviceProvider.MAP_SERVICE_TYPE === 'MAPBOX') {
                const { success, data, error } = await this.serviceProvider.fetch.Mapbox.reverseGeocoding(longitude, latitude, this.serviceProvider.MAP_SERVICE, options);
                if (!success) {
                    return { success, error };
                }
                return { success, data: data.features[0] };
            }
            if (this.serviceProvider.MAP_SERVICE_TYPE === 'GOOGLE') {
                const { success, data, error } = await this.serviceProvider.fetch.Google.reverseGeocoding(longitude, latitude, this.serviceProvider.MAP_SERVICE, options);
                if (!success) {
                    return { success, error };
                }
                return { success, data };
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    async forwardGeocoding(q, options = {}) {
        try {
            const { MAPBOX } = this.serviceProvider.MAP_SERVICE;
            if (this.serviceProvider.MAP_SERVICE_TYPE === 'MAPBOX') {
                const { success, data, error } = await this.serviceProvider.fetch.Mapbox.forwardGeocoding(q, MAPBOX, options);
                if (!success) {
                    return { success, error };
                }
                return { success, data: data.features[0] };
            }
            else if (this.serviceProvider.MAP_SERVICE_TYPE === 'GOOGLE') {
                const { GOOGLE } = this.serviceProvider.MAP_SERVICE;
                const { success, data, error } = await this.serviceProvider.fetch.Google.forwardGeocoding(q, GOOGLE, options);
                if (!success) {
                    return { success, error };
                }
                return { success, data: data.results[0] };
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}