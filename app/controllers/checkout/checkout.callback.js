export class CheckoutCallbackController {
    constructor(checkoutCallbackService) {
        this.checkoutCallbackService = checkoutCallbackService;
        this.checkoutCallback = this.checkoutCallback.bind(this);
    }
    async checkoutCallback(req, res) {
        try {
            const payload = {
                ...req.body,
                orderId: req.order.orderId,
            }
            const { success, checkout, error } = await this.checkoutCallbackService.checkoutCallback(req.transaction, payload);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(checkout, 200, "Checkout initiated");
        } catch (error) {
            return res.ApiResponse.error(400, error);
        }
    }
    async updateTransaction(req, res) {
        try {
            const { success, checkout, error } = await this.checkoutCallbackService.updateTransaction(req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(checkout, 200, "Checkout initiated");
        } catch (error) {
            return res.ApiResponse.error(400, error);
        }
    }
}