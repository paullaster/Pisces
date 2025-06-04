import { models } from "../../data/integrations/database/models/index.js";

const { OrderItem } = models;
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const CheckoutHandler = (req, res, next) => {
    try {
        const response = req.body.Body.stkCallback;
        const query = {
            merchantRequestID: response.MerchantRequestID,
            checkoutRequestID: response.CheckoutRequestID,
        };
        req.query = query;
        req.body = response;
        // req.cartModels = [Item];
        req.orderModels = [OrderItem];
        next();
    } catch (error) {
        return res.ApiResponse.error(500, error.message);
    }
}