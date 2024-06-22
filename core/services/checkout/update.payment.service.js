export class UpdatePaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.updatePaymentRequest = this.updatePaymentRequest.bind(this);
    }
    async updatePaymentRequest(paymentRequest, payload) {
        try {
            const { success, error, data } = await this.paymentRequestRepository.update(paymentRequest, payload);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}