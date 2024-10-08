import mpesa from "../../../config/mpesa.js";
import { JoiSanitizer } from "../../middleware/joisanitizer.js";
import Cart from "../../../data/integrations/database/models/cart.js";
import { SequilizeCartRepository } from "../../../data/interfaces/sequilize.cart.repository.js";
import { FetchCartService } from "../../../core/services/cart/fetch.cart.service.js";
import { FetchPaymentRequestService } from "../../../core/services/checkout/get.payment.service.js";
import { SequelizeTransactionRepository } from "../../../data/interfaces/sequilize.transaction.respository.js";
import Transaction from "../../../data/integrations/database/models/transaction.js";

export class InitiateCheckoutController {
    constructor(initiateCheckoutService) {
        this.initiateCheckoutService = initiateCheckoutService;
        this.initiateCheckout = this.initiateCheckout.bind(this);
        this.getTransactionAmount = this.getTransactionAmount.bind(this);
        this.checkIfPaymentRequestForcheckoutIdExists = this.checkIfPaymentRequestForcheckoutIdExists.bind(this);
    }
    async initiateCheckout(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Missing item body');
            }
            const joiSanitizer = new JoiSanitizer();
            const validationResult = joiSanitizer.cleanMpesaCheckout(req.body);
            if (validationResult.error) {
                return res.ApiResponse.error(400, validationResult.error.details[0].message);
            }
            // Check if payment request for this checkout ID already exists
            const {success:proceed, error:erMsg} = await this.checkIfPaymentRequestForcheckoutIdExists(validationResult.value.checkoutId);
            if (!proceed) {
                return res.ApiResponse.error(400, erMsg);
            }
            // Get transaction amount from cart and shipping rate.
            const {success:g, amount, error:e }  = await this.getTransactionAmount(req, res);
            if (!g) {
                return res.ApiResponse.error(500, e);
            }
            const transactionBody = {
                ...validationResult.value,
                TransactionType: mpesa.transactiontype,
                amount,
                TransactionDesc: "Online for payment of ordered items",
            }
            const { success, data, error } = await this.initiateCheckoutService.initiatePaymentRequest(transactionBody);
            if (!success) {
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success(data, 200, data.transactionMessage);
        } catch (error) {
            console.log(error);
            return res.ApiResponse.error(400, error);
        }
    }
    async checkIfPaymentRequestForcheckoutIdExists(checkoutId) {
        try {
            const fetchPaymentRequestService = new FetchPaymentRequestService(new SequelizeTransactionRepository(Transaction));
            const { success, data } = await fetchPaymentRequestService.fetchPaymentRequestWithUniqueKeys(
                { checkoutId },
                { 
                    order: [['createdAt', 'DESC']] 
                }
            );
            if (success && Object.keys(data).length) {
                if (data.status === 'Completed') {
                    return { success: false, error: 'Payment for this checkout ID has already been paid for. Please contact the administrator for support!' };
                }
                const twoMinsSinceRequestInitiated = Date.now() - (new Date(data.createdAt).getTime());
                if (twoMinsSinceRequestInitiated < 150000) {
                    return {
                        success: false,
                        error: 'Payment for this checkout ID has already been initiated within the last 2 minutes. Please try again later!'
                    };
                }
                return { success: true };
            }
            return { success: true, };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getTransactionAmount(req, res) {
        try {
            const cartService = new FetchCartService(new SequilizeCartRepository(Cart));
            const { success, cart, error } = await cartService.fetchCart(req.user.userId, req.model)
            if (!success) {
                return { success: false, error: error }
            }
            let amount = cart.Items.reduce((sum, current) => sum + parseFloat(current.totalPrice), 0);
            amount += parseFloat(cart.shippingRate);
            return { success: true, amount };
        } catch (error) {
            console.log("error", error);
            return { success: false, error: error.message }
        }
    }
}