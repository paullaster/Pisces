import bcrypt from 'bcrypt';
import { eventEmmitter } from '../../../app/events/index.js';
import app from '../../../config/app.js';
import { SequelizeUserRespository } from '../../../data/interfaces/sequelize.user.repository.js';

class LoginUseCase {
    /**
     * 
     * @param {SequelizeUserRespository} userRespository 
     */
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
        this.getUser = this.getUser.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.getUserById = this.getUserById.bind(this);
    }
    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @returns 
     */
    async handle(username, password) {
        try {
            const result = await this.userRespository.getUserByUsername(username);
            if (!result.success) {
                return { error: result.error, success: false };
            }
            if (!('user' in result) || !result.user) {
                return { success: false, error: 'User not found' };
            }
            const { user, success } = result;
            const decodePassword = Buffer.from(password, 'base64').toString('utf-8');
            const isPasswordMatch = await bcrypt.compare(decodePassword, this.userRespository.userPassword)
            if (isPasswordMatch !== true) {
                return { error: "Password mismatch", success: false };
            }
            return { success, user };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {string} userId 
     * @returns 
     */
    async getUserById(userId) {
        try {
            let result = await this.userRespository.getUserById(userId);
            if (!result.success) {
                return { error: result.error, success: result.success };
            }
            if (!('user' in result) || !result.user) {
                return { success: false, error: 'User not found' };
            }
            const { user, success } = result;
            return { user, success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} obj 
     * @param {*} model 
     * @returns 
     */
    async createTempUser(obj, model) {
        try {
            let result = await this.userRespository.createTempCustomer(obj, model);
            if (!('success' in result) || !result.success) {
                return { success: false, error: result.error };
            }
            if (!('user' in result) || !result.user) {
                return { success: false, error: "User not found" };
            }
            const { success, user } = result;
            return { user, success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} notifiable 
     * @param {*} notificationType 
     * @returns 
     */
    async sendOTP(notifiable, notificationType) {
        try {
            if (notifiable && notificationType) {
                eventEmmitter.emit('sendOTP-newcustomer', { notifiable, notificationType });
                return { success: true }
            }
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {string} username 
     * @returns 
     */
    async getUser(username) {
        try {
            let result = await this.userRespository.getUserByUsername(username);
            if (!('success' in result) || !result.success) {
                return { success: false, error: result.error };
            }
            if (!('user' in result) || !result.user) {
                return { success: false, error: "User not found!" };
            }
            const { user, success } = result;
            return { user, success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async deleteUser(user) {
        try {
            let { success, error } = await this.userRespository.delete(user);
            if (!success) {
                return { error, success };
            }
            return { success };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} option 
     * @param {*} model 
     * @returns 
     */
    async verifyOTP(option, model) {
        try {
            let { success, error, user } = await this.userRespository.verifyOTP(option, model);
            if (!success) {
                return { error, success };
            }
            return { success, user };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    async updateUserProfile(username, payload) {
        try {
            const password = Buffer.from(payload.password, 'base64').toString('utf-8');
            const usrname = Buffer.from(username, 'base64').toString('utf-8');
            const salt = await bcrypt.genSalt(parseInt(String(app.pwdRounds || 10)));
            payload.password = await bcrypt.hash(password, salt);
            let { success, error, user } = await this.userRespository.update(usrname, payload);
            if (!success) {
                return { error, success };
            }
            return { success, user };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
}

export default LoginUseCase;