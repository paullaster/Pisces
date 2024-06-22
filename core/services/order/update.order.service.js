export class UpdateOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.updateOrder = this.updateOrder.bind(this);
    }
    async updateOrder(order, payload) {
        try {
            if (payload) {
                if (payload['orderStatus']){
                    const { success, error, data } = await this.orderRepository.update(order, payload);
                if (!success) {
                    return { success, error };
                }
                return { success, data };
                }
            }
            return { success: false, error: 'You can only update order status'};
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}