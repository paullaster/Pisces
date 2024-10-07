export class CheckoutCallbackController {
    constructor(checkoutCallbackService) {
        this.checkoutCallbackService = checkoutCallbackService;
        this.checkoutCallback = this.checkoutCallback.bind(this);
    }
    async checkoutCallback(req, res) {
        try {
            //LOGG TO FILE SYSTEM ASYNCHRONOUS
            const payload = req.body.Body.stkCallback
            await this.checkoutCallbackService.updatePaymentRequest(payload)
            return res.ApiResponse.success();
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
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