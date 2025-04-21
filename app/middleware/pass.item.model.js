import { models } from "../../data/integrations/database/models/index.js";

const { CartItem } = models;
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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