import { ValidateObjectPayload } from "../../validation/validate.object.payload";
import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";
export class CreateOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.createOrder = this.createOrder.bind(this);
    }
    async createOrder(userId, model, payload) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            if (!payload) {
                return { success: false, error: "Unkwon error" };
            }
            if (typeof payload!=='object') {
                return { success: false, error: "Unkown error!" };
            }
            if (Object.keys(payload).length===0) {
                return { success: false, error: "Unkown error!" };
            }
            payload.orderId = RandomCodeGenerator(6, 'order');
            payload.userId = userId;
            new ValidateObjectPayload(payload);
            const { success, error, data:order } = await this.orderRepository.create(payload, model);
            if (!success) {
                return { success: false, error };
            }
            return { success, error, order };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}