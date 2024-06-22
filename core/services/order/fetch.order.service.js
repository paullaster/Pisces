export class FetchOrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.fetchOrder = this.fetchOrder.bind(this);
    }
    async fetchOrder(oid) {
        try {
            if (!oid) {
                return {success: false, error: 'Order ID is required'};
            }
            if (typeof oid!=='string') {
                return {success: false, error: 'Order ID must be a string'};
            }
            return {success: true, order: await this.orderRepository.fetch(oid)};
        } catch (error) {
            return {success: false, error: error.message}
        }
    }
}