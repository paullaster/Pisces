export class InitiateCheckoutController {
    constructor(initiateCheckoutService) {
        this.initiateCheckoutService = initiateCheckoutService;
        this.initiateCheckout = this.initiateCheckout.bind(this);
    }
    async initiateCheckout(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Missing item body');
            }
            const { success, data, error } = await this.initiateCheckoutService.initiatePaymentRequest(req.body);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(data, 200, data.transactionMessage);
        } catch (error) {
            return res.ApiResponse.error(400, error);
        }
    }
}