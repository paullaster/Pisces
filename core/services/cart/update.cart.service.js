import { ValidateObjectPayload } from "../../validation/validate.object.payload";

export class UpdateCartService {
    constructor(cartRespository) {
        this.cartRespository = cartRespository;
        this.updateCart = this.updateCart.bind(this);
    }
    async updateCart(userId, cartItemId, payload) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            if (!cartItemId) {
                return { success: false, error: "Invalid cart item!" };
            }
            if (!payload) {
                return { success: false, error: "Can't add empty item to cart!" };
            }
            if (typeof payload!=='object') {
                return { success: false, error: "Object expected!" };
            }
            if (!Object.keys(payload).length) {
                return { success: false, error: "Can't add empty item to cart!" };
            }
            new ValidateObjectPayload(payload);
            const { success, error, data:cart } = await this.cartRespository.update(userId, cartItemId, payload);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}