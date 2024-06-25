export class FetchOrderController {
    constructor(fetchOrderService) {
        this.fetchOrderService = fetchOrderService;
        this.fetchOrder = this.fetchOrder.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
        this.fetchOrderItems = this.fetchOrderItems.bind(this);
    }
    async fetchOrder(req, res) {
        try {
            const { success, order, error } = await this.fetchOrderService.fetchOrder(req.params.orderId, req.model);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(order, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchOrders(req, res) {
        try {
            if (req.query) {
                const { page, limit, ...options } = req.query;
                const { success, orders, error } = await this.fetchOrderService.fetchOrders(req.model, options, page, limit);
                if (!success) {
                    return res.ApiResponse.error(500, error);
                }
                return res.ApiResponse.success(orders, 200, " ");
            }
            const { success, orders, error } = await this.fetchOrderService.fetchOrders(req.model, );
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(orders, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async fetchOrderItems(req, res) {
        try {
            const { success, order, error } = await this.fetchOrderService.getOrderItems(req.params.orderId, req.model);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(order, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}