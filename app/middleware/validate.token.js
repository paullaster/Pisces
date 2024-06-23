import jwt from 'jsonwebtoken';
import app from '../../config/app.js';

export const validateUserToken = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.ApiResponse.error(401);
            }
            req.token = token;
            const user = jwt.verify(token, app.key, {algorithms: 'HS512'});
            req.user = user;
        }else {
            return res.ApiResponse.error(401);
        }
        next();
    } catch (error) {
        return res.ApiResponse.error(401, error.message);
    }
};