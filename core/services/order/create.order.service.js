export class CreateOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.createOrder = this.createOrder.bind(this);
    }
    async createOrder(userId, payload) {
        try {
            const { success, error, data } = await this.orderRepository.create(userId, payload);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}