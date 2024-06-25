export class FetchPaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.fetchPaymentRequest = this.fetchPaymentRequest.bind(this);
        this.fetchPaymentRequestWithUniqueKeys = this.fetchPaymentRequestWithUniqueKeys.bind(this);
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
    async fetchPaymentRequestWithUniqueKeys(keys) { 
        try {
            if (!Object.keys(keys).length) {
                return { success: false, error: 'Keys are required' };
            }
            const { success, data, error } = await this.paymentRequestRepository.getTransactionByUniqueProperty(keys);
            if (!success) {
                return { success, error };
            }
            return { success, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}