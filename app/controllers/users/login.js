import jwt from "jsonwebtoken";
import app from "../../../config/app.js";
import { valueType } from "../../../common/get.customer.payload.type.js";
import { models } from "../../../data/integrations/database/models/index.js";
import LoginUseCase from "../../../core/services/auth/login.service.js";
import { OTPInterface } from "../../../core/services/otp/otpUsecase.js"; // Import OTP service
import { SequelizeOTPRepository } from "../../../data/interfaces/Sequelize.otp.respository.js"; // Import repository

const { Otp } = models;
const otpRepository = new SequelizeOTPRepository(Otp); // Initialize repository
const otpService = new OTPInterface(otpRepository); // Initialize OTP service

/**
 * Extracts and validates the customer payload from the request.
 * @param {string} username
 * @param {object} req
 * @returns {{ value?: object, error?: string }}
 */
function getValidatedCustomerPayload(username, req) {
    const value = valueType(username);
    if (value.type === 'unknown') {
        return { error: "Invalid email or phone" };
    }
    value.requestingDevice = req.headers['user-agent'];
    return { value };
}

class LoginController {
    /**
     * 
     * @param {LoginUseCase} LoginUseCase 
     */
    constructor(LoginUseCase) {
        this.LoginUseCase = LoginUseCase;
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.OTP = this.createTempUser.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
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

            if (!success || !user) {
                return res.ApiResponse.error(400, error || 'User not found');
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
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
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
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getUser(req, res) {
        try {
            const { username } = req.body;
            const { success, user, error } = await this.LoginUseCase.getUser(username);
            if (!success || !user) {
                return await this.createTempUser(req, res, error);
            }
            if (user && user.type !== 'admin' && (!user.veryfied || !user.completed)) {
                // Use OTP service to generate and send OTP
                const { success: otpSuccess, otp, expiryTime, purpose, message } = await otpService.generateOTP(String(user.id), "newAccount");
                if (!otpSuccess) {
                    return res.ApiResponse.error(500, message || "Failed to generate OTP");
                }
                const { error: validationError, value } = getValidatedCustomerPayload(req.body.username, req)
                if (validationError) return res.ApiResponse(500, validationError);
                const result = await otpService.sendOTP({ otp, expiryTime, user }, value);
                if (!result) {
                    return res.ApiResponse.error(500, "Failed to send OTP");
                }
                const { success: otpSent, error: e } = result;

                if (otpSent) {
                    return res.ApiResponse.success({ otp: true, loginType: value.type, id: user.id, purpose }, 200, "We have sent One Time Password to your " + value.type);
                } else {
                    return res.ApiResponse.error(500, e);
                }
            }
            return res.ApiResponse.success({ exist: true, user }, 200);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    /**
     * Creates a temporary user and sends an OTP.
     * @param {*} req 
     * @param {*} res 
     * @param {*} error 
     * @returns 
     */
    async createTempUser(req, res, error) {
        try {
            const { username } = req.body;
            if (req.body?.type === 'customer') {
                const { value, error: validationError } = getValidatedCustomerPayload(username, req);
                if (validationError) {
                    return res.ApiResponse.error(400, validationError);
                }

                const { success: s, user, error: err } = await this.LoginUseCase.createTempUser(value, Otp);
                if (!s || !user) {
                    return res.ApiResponse.error(499, err || 'User creation failed');
                }

                // Use OTP service to generate and send OTP
                const { success: otpSuccess, otp, expiryTime, message } = await otpService.generateOTP(String(user.id), "newAccount");
                if (!otpSuccess) {
                    return res.ApiResponse.error(500, message || "Failed to generate OTP");
                }

                const result = await otpService.sendOTP({ otp, expiryTime, user }, value);
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
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async resendOTP(req, res) {
        try {
            const [username, type, usernameType] = Buffer.from(req.body.datapoint, 'base64').toString('utf-8').split(":");
            if (type !== 'customer') return res.ApiResponse.error(400, 'Action can be performed by customers only!');
            const { success, user, error } = await this.LoginUseCase.getUserByUsername(username);
            if (!success) return res.ApiResponse.error(500, error);

            // Use OTP service to generate and send OTP
            const { success: otpSuccess, otp, expiryTime, message } = await otpService.generateOTP(String(user?.id), "newAccount");
            if (!otpSuccess) {
                return res.ApiResponse.error(500, message || "Failed to generate OTP");
            }
            const value = {
                type: usernameType,
                value: username,
                requestingDevice: req.headers['user-agent']
            }
            const result = await otpService.sendOTP({ otp, expiryTime, user }, value);
            if (!result) {
                return res.ApiResponse.error(500, "Failed to send OTP");
            }
            const { success: otpSent, error: e } = result;

            if (otpSent) {
                return res.ApiResponse.success({ otp: true, loginType: value.type }, 200, "We have sent One Time Password to your " + value.type);
            } else {
                return res.ApiResponse.error(500, e);
            }

        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async verifyOTP(req, res) {
        try {
            const { otp, datapoint } = req.body;
            const datapointString = Buffer.from(datapoint, 'base64').toString('utf-8');
            const [, , , id, purpose] = datapointString.split(':');
            const { Otp } = models;
            const otpUsecase = new OTPInterface(new SequelizeOTPRepository(Otp));
            const { success: verified, message } = await otpUsecase.verifyOTP(id, otp, purpose);
            if (!verified) {
                return res.ApiResponse.error(400, message);
            }
            return res.ApiResponse.success({}, 200, message);
        } catch (error) {
            return res.ApiResponse.error(500, error.message);
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async updateUserProfile(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.ApiResponse.error(400, 'Invalid request. Missing required parameter');
            }
            const id = Buffer.from(userId, 'base64').toString('utf-8');
            const { success, user, error } = await this.LoginUseCase.updateUserProfile(id, req.body);
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