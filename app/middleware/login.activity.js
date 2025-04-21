import date_formats from "../../common/date_formats.js";

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const loginActivity = (req, res, next) => {
    req.body.lastLogin = new Date();
    next();
}