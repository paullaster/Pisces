export class DeletePaymentRequestController {
    constructor(deletePaymentRequestService) {
        this.deletePaymentRequestService = deletePaymentRequestService;
        this.deletePaymentRequest = this.deletePaymentRequest.bind(this);
    }
    async deletePaymentRequest(req, res) {
        try {
            if (!req.params.paymentRequestId) {
                return res.ApiResponse.error(400, 'The payment request ID is required');
            }
            const {success, paymentRequest, error } = await this.deletePaymentRequestService.deletePaymentRequest(req.params.paymentRequestId);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(paymentRequest, 200, "Payment request deleted");
        } catch (error) {
            return res.ApiResponse.error(400, error);
        }
    }
}