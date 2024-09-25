import Item from "../../data/integrations/database/models/cartItem.js";
export const CheckoutHandler = (req, res, next) => {
    try {
        const response = req.body.Body.stkCallback;
        const query = {
            merchantRequestID: response.MerchantRequestID,
            checkoutRequestID: response.CheckoutRequestID,
        };
        req.query = query;
        req.body = response;
        req.cartModels = [Item];
        req.orderModels = [Item];
        next();
    } catch (error) {
        return res.ApiResponse.error(500, error.message);
    }
}