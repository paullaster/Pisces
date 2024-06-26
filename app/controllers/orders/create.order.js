export class CreateOrderController {
    constructor(createOrderService) {
        this.createOrderService = createOrderService;
        this.createOrder = this.createOrder.bind(this);
    }
    async createOrder(req, res, next) {
        try {
            const orderObject = {
                items: req.cart.Items,
            }
            const { success, order, error } = await this.createOrderService.createOrder(req.cart.userId, req.orderModels, orderObject);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }else {
                req.order = order;
                next();
            }
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}