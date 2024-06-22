export class UpdateOrderController {
    constructor(updateOrderService) {
        this.updateOrderService = updateOrderService;
        this.updateOrder = this.updateOrder.bind(this);
    }
    async updateOrder(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Missing order body');
            }
            const { success, order, error } = await this.updateOrderService.updateOrder(req.params.orderId, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(201, order);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}