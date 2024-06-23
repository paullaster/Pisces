import Item from "../../data/integrations/database/models/items.js";
export const itemModelMiddleware = (req, res, next) => {
    try {
        req.model = Item;;
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
}