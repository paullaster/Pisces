import { UpdateCartService } from "../../../core/services/cart/update.cart.service.js";
import { SequilizeCartRepository } from "../../../data/interfaces/sequilize.cart.repository.js";
import Cart from "../../../data/integrations/database/models/cart.js";

export class MapController {
    constructor(mapService) {
        this.mapService = mapService;
        this.durationDistanceMatrix = this.durationDistanceMatrix.bind(this);
        this.reverseGeocoding = this.reverseGeocoding.bind(this);
        this.forwardGeocoding = this.forwardGeocoding.bind(this);
    }
    async durationDistanceMatrix(req, res) {
        try {
            if (!req.body.source || !req.body.destination) {
                return res.ApiResponse.error(400, 'Source and destination coordinates are required');
            }
            const { success, data, error } = await this.mapService.durationDistanceMatrix(req.body.source, req.body.destination, req.body.options,);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            const cartRepo = new SequilizeCartRepository(Cart);
            const cartService = new UpdateCartService(cartRepo);
            const { success: feedback, errorerLog, cart } = await cartService.updateCartShippingRate(req.user.userId, { shippingRate: data.price });
            if (!feedback) {
                return res.ApiResponse.error(500, errorerLog);
            }
            return res.ApiResponse.success(cart, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async reverseGeocoding(req, res) {
        try {
            if (!req.query.longitude || !req.query.latitude) {
                return res.ApiResponse.error(400, 'Longitude and latitude are required');
            }
            const { longitude, latitude, ...options } = req.query;
            const { success, data, error } = await this.mapService.reverseGeocoding(longitude, latitude, options);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(data, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async forwardGeocoding(req, res) {
        try {
            if (!req.query.q) {
                return res.ApiResponse.error(400, 'Search query is required');
            }
            const { q, ...options } = req.query;
            const { success, data, error } = await this.mapService.forwardGeocoding(q, options);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(data, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}