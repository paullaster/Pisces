import verifyJwtToken from '../../common/verify.jwt.token.js';
import app from '../../infrastructure/config/app.js';

export const validateUserToken = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.ApiResponse.error(401);
            }
            req.token = token;
            const user = verifyJwtToken(token, app);
            req.user = user;
        } else {
            return res.ApiResponse.error(401);
        }
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
};