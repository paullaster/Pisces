export class DeleteOrderController {
    constructor(deleteOrderService) {
        this.deleteOrderService = deleteOrderService;
        this.deleteOrder = this.deleteOrder.bind(this);
    }
    async deleteOrder(req, res) {
        try {
            if (!req.params.orderId) {
                return res.ApiResponse.error(400, 'The order ID is required');
            }
            const {success, order, error } = await this.deleteOrderService.deleteOrder(req.params.orderId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(201, order);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}