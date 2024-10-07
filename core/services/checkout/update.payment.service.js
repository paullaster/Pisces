export class UpdatePaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.updatePaymentRequest = this.updatePaymentRequest.bind(this);
    }
    async updatePaymentRequest(payload) {
        try {
            if (Object.keys(payload).length) {
                return await this.paymentRequestRepository.update(payload);
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}