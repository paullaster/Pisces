export class DeletePaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.deletePaymentRequest = this.deletePaymentRequest.bind(this);
    }
    async deletePaymentRequest(paymentRequestId) {
        try {
            if (!paymentRequestId) {
                return { success: false, error: 'Payment request ID is required' };
            }
            if (typeof paymentRequestId!=='string') {
                return { success: false, error: 'Payment request ID must be a string' };
            }
            const { success, error, data } = await this.paymentRequestRepository.delete(paymentRequestId);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}