export class InitiatePaymentRequestService {
    constructor(paymentRequestRepository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.initiatePaymentRequest = this.initiatePaymentRequest.bind(this);
    }
    async initiatePaymentRequest(userId, payload) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            const { success, error, data } = await this.paymentRequestRepository.create(userId, payload);
            return { success, error, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}