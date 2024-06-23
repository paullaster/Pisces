export class CreateOrderController {
    constructor(createOrderService) {
        this.createOrderService = createOrderService;
        this.createOrder = this.createOrder.bind(this);
    }
    async createOrder(req, res, next) {
        try {
            const orderObject = {
                items: req.orderItems,
            }
            const { success, order, error } = await this.createOrderService.createOrder(req.user.userId, req.orderModels, orderObject);
            if (!success) {
                next(error);
            }else {
                req.order = order;
                next(req, res);
            }
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}