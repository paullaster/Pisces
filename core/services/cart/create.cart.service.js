import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";


export class CreateCartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
        this.createCart = this.createCart.bind(this);
    }
    async createCart(userId, payload, model) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            if (!payload) {
                return { success: false, error: "Can't add empty item to cart!" };
            }
            if (typeof payload !== 'object') {
                return { success: false, error: "Item must be a key value pair of item information" };
            }
            if (Object.keys(payload).length === 0) {
                return { success: false, error: "Can't add empty item to cart!" };
            }
            payload.cartId = RandomCodeGenerator(40, 'CT');
            payload.userId = userId;
            payload.item.itemId = RandomCodeGenerator(10, 'CI');
            payload.item.cartId = payload.cartId;
            new ValidateObjectPayload(payload);
            const { success, error, data: cart } = await this.cartRepository.create(userId, payload, model);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}