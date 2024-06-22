export class FetchOrderController {
    constructor(fetchOrderService) {
        this.fetchOrderService = fetchOrderService;
        this.fetchOrder = this.fetchOrder.bind(this);
    }
    async fetchOrder(req, res) {
        try {
            const { success, order, error } = await this.fetchOrderService.fetchOrder(req.params.orderId, req.model);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(order, 200, " ");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    
}