export class FetchPaymentRequestController {
    constructor(fetchPaymentRequestService) {
        this.fetchPaymentRequestService = fetchPaymentRequestService;
        this.fetchPaymentRequest = this.fetchPaymentRequest.bind(this);
        this.fetchPaymentRequestWithUniqueKeys = this.fetchPaymentRequestWithUniqueKeys.bind(this);
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
    async fetchPaymentRequestWithUniqueKeys(req, res, next) {
        try {
            if (!Object.keys(req.query).length) {
                return res.ApiResponse.error(400, 'Keys are required');
            }
            const { success, data, error } = await this.fetchPaymentRequestService.fetchPaymentRequestWithUniqueKeys(req.query);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }else {
                req.transaction = data;
                next();
            }
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
}