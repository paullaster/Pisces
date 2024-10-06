import {ValidateObjectPayload} from "../../validation/validate.object.payload.js"; 

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
            const { success, transaction, error } = await this.paymentGateway.NIPush(rest);
            if (!success) {
                return { success, error };
            }
            if (transaction.ResponseCode !== '0') {
                return {success: false, error: transaction.ResponseDescription};
            }
            const transBody = {
                transId: transaction.transId,
                phoneNumber: rest.phoneNumber,
                amount: rest.amount,
                status: 'Pending',
                checkoutRequestID: transaction.CheckoutRequestID,
                merchantRequestID: transaction.MerchantRequestID,
                transactionMessage: transaction.ResponseDescription,
                checkoutId: checkoutId,
                paymentMethod: 'Mpesa',
            }
            const { success: isNotfailed, data, error:err } = await this.paymentRequestRepository.create(transBody);
            if (!isNotfailed) {
                return { success: isNotfailed, error: err };
            }

            return { success: isNotfailed, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}