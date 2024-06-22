export class UpdateOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.updateOrder = this.updateOrder.bind(this);
    }
    async updateOrder(oid, payload) {
        try {
            const { success, error, data } = await this.orderRepository.update(oid, payload);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}