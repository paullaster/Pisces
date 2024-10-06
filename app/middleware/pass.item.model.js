import CartItem from "../../data/integrations/database/models/cartItem.js";
export const itemModelMiddleware = (req, res, next) => {
    try {
        req.model = [
            {
                model: CartItem,
                as: 'Items',
            },
        ];
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}