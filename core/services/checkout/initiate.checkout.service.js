import ValidateObjectPayload from "../../validation/validate.object.payload.js"; 
import { RandomCodeGenerator } from "../../../common/generating_unique_codes.js";

export class InitiatePaymentRequestService {
    constructor(paymentRequestRepository, paymentGateway) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.paymentGateway = paymentGateway;
        this.initiatePaymentRequest = this.initiatePaymentRequest.bind(this);
    }
    async initiatePaymentRequest(payload) {
        try {
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
            const { success, transaction, error } = this.paymentGateway.NIPush(rest);
            if (success) {
                if (transaction.ResponseCode < 1 && checkoutId) {
                    await this.transactionRepository.create({
                        transId: transaction.transId,
                        phoneNumber: rest.phoneNumber,
                        amount: rest.amount,
                        status: 'Pending',
                        checkoutRequestID: transaction.CheckoutRequestID,
                        merchantRequestID: transaction.MerchantRequestID,
                        transactionMessage: transaction.ResponseDescription,
                        checkoutId: checkoutId,
                    });
                    return {success: true, data: response.data};
                }
                return { success, error };
            }
            return { success, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}