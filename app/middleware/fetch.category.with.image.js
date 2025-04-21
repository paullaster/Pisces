import { models } from "../../data/integrations/database/models/index.js";
const { Image } = models;
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const categoryImageMiddleware = (req, res, next) => {
    try {
        req.model = [{ model: Image, where: { imagableType: 'Category' }, attributes: ['imgId', 'mimetype'] }];
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}