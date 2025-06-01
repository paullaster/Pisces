import mpesa from "../../../infrastructure/config/mpesa.js";
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
    }
    async initiateCheckout(req, res) {
        try {
            const joiSanitizer = new JoiSanitizer();
            const { provider } = req.params;
            const idempotencyKey = req.headers['x-idempotency-key'];
            const requiredParams = joiSanitizer.checkoutRequiredRequestValues({
                provider,
                'X-Idempotency-Key': idempotencyKey,
            });
            if (requiredParams.error) {
                return res.ApiResponse.error(400, requiredParams.error.details[0].message);
            }
            const validationResult = joiSanitizer.cleanMpesaCheckout(req.body);
            if (validationResult.error) {
                return res.ApiResponse.error(400, validationResult.error.details[0].message);
            }

            // Get transaction amount from cart and shipping rate.
            // const { success: g, amount, error: e } = await this.getTransactionAmount(req, res);
            // if (!g) {
            //     return res.ApiResponse.error(500, e);
            // }
            // const transactionBody = {
            //     ...validationResult.value,
            //     TransactionType: mpesa.transactiontype,
            //     amount,
            //     TransactionDesc: "Online for payment of ordered items",
            // }
            const { success, data, error } = await this.initiateCheckoutService.initiatePaymentRequest(req.user.id, req.params.provider, idempotencyKey, req.body);
            if (!success) {
                return res.ApiResponse.error(500, error, data);
            }
            return res.ApiResponse.success(data, 200, data.transactionMessage);
        } catch (error) {
            console.log(error);
            return res.ApiResponse.error(400, error);
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