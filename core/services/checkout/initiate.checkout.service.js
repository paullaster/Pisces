import ValidateObjectPayload from "../../validation/validate.object.payload.js"; 

export class InitiatePaymentRequestService {
    constructor(paymentRequestRepository, paymentGateway) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.paymentGateway = paymentGateway;
        this.initiatePaymentRequest = this.initiatePaymentRequest.bind(this);
    }
    async initiatePaymentRequest(userId, payload) {
        try {
            if (!userId) {
                return { success: false, error: "Invalid user!" };
            }
            if (!payload) {
                return { success: false, error: "Invalid payload!" };
            }
            if (typeof payload!=='object') {
                return { success: false, error: "Object expected!" };
            }
            if (Object.keys(payload).length===0) {
                return { success: false, error: "Invalid payload!" };
            }
            new ValidateObjectPayload(payload);
            const { checkoutId, ...rest} = payload;
            const { success, data, error } = this.paymentGateway.NIPush(rest, checkoutId);
            if (!success) {
                return { success, error };
            }
            return { success, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}