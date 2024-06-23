import Item from "../../data/integrations/database/models/items.js";
export const CheckoutHandler = (req, res, next) => {
    try {
        const response = req.body.Body.stkCallback;
        const query = {
            merchantRequestID: response.merchantRequestID,
            checkoutRequestID: response.checkoutRequestID,
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