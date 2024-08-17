import Image from "../../data/integrations/database/models/images.js";
export const categoryImageMiddleware = (req, res, next) => {
    try {
        req.model = [{model: Image, where: { imagableType: 'Category' }, attributes: ['imgId', 'mimetype']}];
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}