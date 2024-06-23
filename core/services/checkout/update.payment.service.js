export class UpdatePaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.updatePaymentRequest = this.updatePaymentRequest.bind(this);
    }
    async updatePaymentRequest(transaction, payload) {
        try {
            if (payload.ResultCode !== 0) {
                await this.paymentRequestRepository.delete({ checkoutRequestID: payload.CheckoutRequestID });
                // add listener to transaction table change event
            } else {
                await this.paymentRequestRepository.update(transaction, payload);
                // add listener to transaction table change event
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}