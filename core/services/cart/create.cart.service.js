import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";


export class CreateCartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
        this.createCart = this.createCart.bind(this);
    }
    async createCart(userId, payload) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            if (!payload) {
                return { success: false, error: "Can't add empty item to cart!" };
            }
            if (typeof payload!=='object') {
                return { success: false, error: "Item must be a key value pair of item information" };
            }
            if (Object.keys(payload).length===0) {
                return { success: false, error: "Can't add empty item to cart!" };
            }

            payload.cartId = RandomCodeGenerator(5, 'cart');
            payload.userId = userId;
            payload.items.forEach(item => item.itemId = RandomCodeGenerator(5, 'item'));
            new ValidateObjectPayload(payload);
            const { success, error, data:cart } = await this.cartRepository.create(payload);
            if (!success) {
                return { success: false, error };
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}