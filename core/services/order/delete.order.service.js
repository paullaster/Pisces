export class DeleteOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.deleteOrder = this.deleteOrder.bind(this);
    }
    async deleteOrder(oid) {
        try {
            if (!oid) {
                return {success: false, error: 'Order ID is required'};
            }
            if (typeof oid!=='string') {
                return {success: false, error: 'Order ID must be a string'};
            }
            return {success: true, order: await this.orderRepository.delete(oid)};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}