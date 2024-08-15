import Image from "../../data/integrations/database/models/images.js";
export const productImageMiddleware = (req, res, next) => {
    try {
        req.model = [{model: Image, where: { imagableType: 'Product' }, attributes: ['imgId', 'mimetype']}];
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}