export class FetchPaymentRequestController {
    constructor(fetchPaymentRequestService) {
        this.fetchPaymentRequestService = fetchPaymentRequestService;
        this.fetchPaymentRequest = this.fetchPaymentRequest.bind(this);
    }
    async fetchPaymentRequest(req, res) {
        try {
            const { success, paymentRequest, error } = await this.fetchPaymentRequestService.fetchPaymentRequest(req.params.paymentRequestId);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(paymentRequest, 200, "Payment request fetched");
        } catch (error) {
            return res.ApiResponse.error(400, error);
        }
    }
}