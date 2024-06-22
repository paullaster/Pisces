export class FetchPaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.fetchPaymentRequest = this.fetchPaymentRequest.bind(this);
    }
    async fetchPaymentRequest(paymentRequestId) {
        try {
            if (!paymentRequestId) {
                return { success: false, error: 'Payment request ID is required' };
            }
            if (typeof paymentRequestId!=='string') {
                return { success: false, error: 'Payment request ID must be a string' };
            }
            const { success, paymentRequest, error } = await this.paymentRequestRepository.findById(paymentRequestId);
            return { success, paymentRequest, error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}