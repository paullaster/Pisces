import mpesa from "../../../config/mpesa.js";
import { JoiSanitizer } from "../../middleware/joisanitizer.js";
import Cart from "../../../data/integrations/database/models/cart.js";
import {SequilizeCartRepository} from "../../../data/interfaces/sequilize.cart.repository.js";
import { FetchCartService } from "../../../core/services/cart/fetch.cart.service.js";

export class InitiateCheckoutController {
    constructor(initiateCheckoutService) {
        this.initiateCheckoutService = initiateCheckoutService;
        this.initiateCheckout = this.initiateCheckout.bind(this);
        this.getTransactionAmount = this.getTransactionAmount.bind(this);
    }
    async initiateCheckout(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400, 'Missing item body');
            }
            const joiSanitizer = new JoiSanitizer();
            const validationResult = joiSanitizer.cleanMpesaCheckout(req.body);
            // return res.ApiResponse.success(validationResult, 200, "data.transactionMessage");
            console.log(validationResult)
            if (validationResult.error){
                return res.ApiResponse.error(400, validationResult.error.details[0].message);
            }
            const {success:g, amount, error:e }  = await this.getTransactionAmount(req, res);
            if (!g) {
                return res.ApiResponse.error(500, e);
            }
            const transactionBody = {
                ...validationResult.value,
                TransactionType: mpesa.transactiontype,
                amount,
                TransactionDesc: "Online checkout for payment of order items",
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
    async getTransactionAmount(req, res) {
        try {
            const cartService = new FetchCartService(new SequilizeCartRepository(Cart));
            console.log("initiated call")
            const {success, cart, error} = await cartService.fetchCart(req.user.userId, req.model)
            if (!success) {
                return { success: false, error: error}
            }
            let amount = cart.Items.reduce((sum, current) => sum + parseFloat(current.totalPrice), 0);
            amount += cart.shippingRate;
            return {success: true, amount};
        } catch (error) {
            console.log("error", error);
            return { success: false, error: error.message}
        }
    }
}