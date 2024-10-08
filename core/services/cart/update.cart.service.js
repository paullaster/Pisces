import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";

export class UpdateCartService {
    constructor(cartRespository) {
        this.cartRespository = cartRespository;
        this.updateCart = this.updateCart.bind(this);
        this.updateCartShippingRate = this.updateCartShippingRate.bind(this);
    }
    async updateCart(userId, cartItemId, payload, model = []) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            if (!cartItemId) {
                return { success: false, error: "Invalid cart item!" };
            }
            if (!payload) {
                return { success: false, error: "Update payload is not valid!" };
            }
            if (typeof payload!=='object') {
                return { success: false, error: "Object expected!" };
            }
            if (!Object.keys(payload).length) {
                return { success: false, error: "Update payload is not valid!" };
            }
            new ValidateObjectPayload(payload);
            const { success, error, data:cart } = await this.cartRespository.update(userId, cartItemId, payload, model);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updateCartShippingRate (user, obj) {
        try {
            if (!user || !obj) {
                return { success:false, error: "Could be having invalid data" };
            }
            const { success, error, data } = await this.cartRespository.updateCartShippingRate(user, obj);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart: data };
        } catch (error) {
            return { success: true, error: error.message };
        }
    }
}