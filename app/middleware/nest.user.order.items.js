import Order from "../../data/integrations/database/models/order.js";
import { models } from "../../data/integrations/database/models/index.js";
const { OrderItem } = models;
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const eagerLoadUserOrdersAndRelated = (req, res, next) => {
    try {
        req.model = [
            {
                model: Order,
                include: [
                    {
                        model: OrderItem,
                    },
                ],
            },
        ];
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}