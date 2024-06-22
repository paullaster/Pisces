export class CreateOrderController {
    constructor(createOrderService) {
        this.createOrderService = createOrderService;
        this.createOrder = this.createOrder.bind(this);
    }
    async createOrder(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Missing order body');
            }
            const { success, order, error } = await this.createOrderService.createOrder(req.params.userId, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(201, order);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}