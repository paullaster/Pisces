import jwt from "jsonwebtoken";
import app from "../../../config/app.js";
import { valueType } from "../../../common/get.customer.payload.type.js";
import { models } from "../../../data/integrations/database/models/index.js";
import LoginUseCase from "../../../core/services/auth/login.service.js";

const { Otp } = models;

class LoginController {
    /**
     * 
     * @param {LoginUseCase} LoginUseCase 
     */
    constructor(LoginUseCase) {
        this.LoginUseCase = LoginUseCase;
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.OTP = this.OTP.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.getUserById = this.getUserById.bind(this);
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async login(req, res) {
        try {
            if (!req.body) {
                return res.ApiResponse.error(400);
            }
            const { username, password } = req.body;
            const { error, success, user } = await this.LoginUseCase.handle(username, password);

            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    userId: user.email,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    type: user.type,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                app.key || 'noelsdeliveries.com#built-with-love-by-paullaster-okoth',
                { algorithm: 'HS512', expiresIn: '1h' }
            );
            return res.ApiResponse.success(token, 200, "Login successful");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async getUserById(req, res) {
        try {
            const { id: userId } = req.user;
            const { success, user, error } = await this.LoginUseCase.getUserById(userId);
            if (!success) {
                return res.ApiResponse.error(404, error);
            }
            return res.ApiResponse.success(user, 200);
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
            if (!user.veryfied || !user.completed) {
                const { success: deleted } = await this.LoginUseCase.deleteUser(user.id);
                if (deleted) {
                    return await this.OTP(req, res, error);
                }
                return res.ApiResponse.error(500, error);
            }
            return res.ApiResponse.success({ exist: true, user }, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async OTP(req, res, error) {
        try {
            const { username } = req.body;
            if (req.body?.type === 'customer') {
                const value = valueType(username);
                if (value.type === 'unknown') {
                    return res.ApiResponse.error(400, "Invalid email or phone");
                }
                value.requestingDevice = req.headers['host'];
                const { success: s, user: userWithOtp, error: err } = await this.LoginUseCase.generateOTP(value, Otp);
                if (!s) {
                    return res.ApiResponse.error(499, err);
                }
                const result = await this.LoginUseCase.sendOTP(userWithOtp, value);
                if (!result) {
                    return res.ApiResponse.error(500, "Failed to send OTP");
                }
                const { success: otpSent, error: e } = result;
                if (otpSent) {
                    return res.ApiResponse.success({ otp: true, loginType: value.type }, 200, "We have sent One Time Password to your " + value.type);
                } else {
                    return res.ApiResponse.error(500, e);
                }
            } else {
                return res.ApiResponse.error(401, error);
            }
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async verifyOTP(req, res) {
        try {
            const { otp, datapoint } = req.body;
            const datapointString = Buffer.from(datapoint, 'base64').toString('utf-8');
            const username = datapointString.split(':')[0];
            const { success, user, error } = await this.LoginUseCase.verifyOTP({ otp, username }, Otp);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(user, 200, "OTP verified successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    async updateUserProfile(req, res) {
        try {
            const { username } = req.params;
            const { success, user, error } = await this.LoginUseCase.updateUserProfile(username, req.body);
            if (!success) {
                return res.ApiResponse.error(400, error);
            }
            return res.ApiResponse.success(user, 200, "User profile updated successfully");
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
};

export default LoginController;