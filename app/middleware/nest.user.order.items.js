import Order from "../../data/integrations/database/models/order.js";
import Item from "../../data/integrations/database/models/cartItem.js";
export const eagerLoadUserOrdersAndRelated = (req, res, next) => {
    try {
        req.model = [
            {
                model: Order,
                include: [
                    {
                        model: Item,
                    },
                ],
            },
        ];
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}