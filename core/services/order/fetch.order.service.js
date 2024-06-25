export class FetchOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.fetchOrder = this.fetchOrder.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
    }
    async fetchOrder(orderId, model) {
        try {
            if (!orderId) {
                return {success: false, error: 'Order ID is required'};
            }
            if (typeof orderId!=='string') {
                return {success: false, error: 'Order ID must be a string'};
            }
            const {success, data:order, error } = await this.orderRepository.getOrderById(orderId, model, 'fetch', true);
            if (!success) {
                return {success: false, error};
            }
            return {success, order};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
    async fetchOrders(model, options = {}, offset = 0, limit = 10){
        try {
            const {success, error, orders } = await this.orderRepository.fetchOrders(model, options, offset, limit);
            if (!success) {
                return  { success, error };
            }
            return { success, orders };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}