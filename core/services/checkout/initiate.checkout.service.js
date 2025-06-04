import { Idempotency } from "../../entities/idempotency.js";
import { ValidateObjectPayload } from "../../validation/validate.object.payload.js";

export class InitiatePaymentRequestService {
    constructor(CartRepository, paymentRequestRepository, paymentGateway, idempotencyRespository) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.paymentGateway = paymentGateway;
        this.cartRepository = CartRepository;
        this.idempotencyRepository = idempotencyRespository;
        this.initiatePaymentRequest = this.initiatePaymentRequest.bind(this);
    }
    async initiatePaymentRequest(userId, provider, idempotencyKey, payload) {
        try {
            if (!provider || !idempotencyKey || !payload) {
                return { success: false, error: "Invalid payload!" };
            }
            if (typeof payload !== 'object') {
                return { success: false, error: "Object expected!" };
            }
            if (Object.keys(payload).length === 0) {
                return { success: false, error: "Invalid payload!" };
            }

            // Idempotency check
            const { success: exist, transaction: trans, error: transactionError } = await this.idempotencyRepository.findById(idempotencyKey);
            if (exist && Object.keys(trans).length) {
                switch (trans.status) {
                    case 'Completed': {
                        return { success: false, error: 'Payment already processed. Please contact administrator for assistance.', data: { checkoutId: idempotencyKey } };
                    };
                    case 'Pending': {
                        const tenMinutesSinceInitiated = Date.now() - new Date(trans.createdAt).getTime();
                        if (tenMinutesSinceInitiated < (10 * 60 * 1000)) {
                            return { success: false, error: 'You have a similar transaction currently in progress.', data: { checkoutId: idempotencyKey } }
                        }
                    };
                }
            }
            await this.idempotencyRepository.save(new Idempotency(idempotencyKey, 'Pending'));

            // get total price to pay:
            const cart = await this.cartRepository.getUserCart(userId, 'fetch', true);
            console.log('logged cart', cart);
            if (!cart) {

            }
            const paymentProvider = this.paymentGateway(provider);

            new ValidateObjectPayload(payload);
            const { success, transaction, error } = await this.paymentGateway.NIPush(payload);
            if (!success) {
                return { success, error };
            }
            if (transaction.ResponseCode !== '0') {
                return { success: false, error: transaction.ResponseDescription };
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
            const { success: isNotfailed, data, error: err } = await this.paymentRequestRepository.create(transBody);
            if (!isNotfailed) {
                return { success: isNotfailed, error: err };
            }

            return { success: isNotfailed, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}