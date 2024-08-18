import  jwt from "jsonwebtoken";
import app from "../../../config/app.js";
import { valueType } from "../../../common/get.customer.payload.type.js";
import Otp from "../../../data/integrations/database/models/user.one.time.passwords.js";
class LoginController {
    constructor(LoginUseCase) {
        this.LoginUseCase = LoginUseCase;
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.OTP = this.OTP.bind(this);
    }
    async login(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400);
            }
            const { username, password } = req.body;
            const { error, success, user } = await this.LoginUseCase.handle(username, password);

            if (!success) {
                return res.ApiResponse.error(401, error);
            }
            const token = jwt.sign({userId: user.email, email: user.email, phoneNumber: user.phoneNumber, type: user.type, name: user.name}, app.key, {algorithm: 'HS512', expiresIn: '1h' });
            return res.ApiResponse.success(token, 200, "Login successful");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async getUser(req, res) {
        try {
            const { username } = req.body;
            const { success, user, error } = await this.LoginUseCase.getUser(username);
            if (!success) {
                return await this.OTP(req, res, error);
            }
            if(!user.veryfied || !user.completed) {
                const {success:deleted} = await this.LoginUseCase.deleteUser(user.id);
                if (deleted) {
                    return await this.OTP(req, res, error);
                }
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success({exist: true, user}, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async OTP(req,res, error){
        try {
            const { username } = req.body;
            if (req.body?.type === 'customer') {
                const value = valueType(username);
                if (value.type === 'unknown') {
                    return res.ApiResponse.error(400, "Invalid email or phone");
                }
                value.requestingDevice = req.headers['host'];
                const { success:s, user:userWithOtp, error:err } = await this.LoginUseCase.generateOTP(value, Otp);
                if(!s) {
                    return res.ApiResponse.error(499, err);
                }
                const {success:otpSent, error:e} = await this.LoginUseCase.sendOTP(userWithOtp, value);
                if (otpSent) {
                    return res.ApiResponse.success({otp : true}, 200, "We have sent One Time Password to your "+value.type);
                }else {
                    return res.ApiResponse.error(500, e);
                }
            }else {
                return res.ApiResponse.error(401, error);
            }
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
};

export default LoginController;