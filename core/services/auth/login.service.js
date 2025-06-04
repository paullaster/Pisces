import bcrypt from 'bcrypt';
import app from '../../../infrastructure/config/app.js';

/**@typedef {import('../../types/user.result.jsdoc.js').UserResult} UserResult*/

class LoginUseCase {
    /**
     * 
     * @param {any} userRespository 
     */
    constructor(userRespository) {
        this.userRespository = userRespository;
        this.handle = this.handle.bind(this);
        this.getUser = this.getUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
    }
    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<UserResult>}
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
     * @returns {Promise<UserResult>}
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
     * @param {*} username 
     * @param {*} model 
     * @returns {Promise<UserResult>}
     */
    async getUserByUsername(username, model = []) {
        try {
            if (!username) return { success: false, error: 'Missing required username' }
            const result = await this.userRespository.getUserByUsername(username, model);
            if (!result.success) return { success: false, error: result.error }
            if (!('user' in result) || !result.user) return { success: false, error: 'User not found!' }
            const { user, success } = result;
            return { user, success }
        } catch (error) {
            return { error: error.message, success: false };
        }
    }
    /**
     * 
     * @param {*} obj 
     * @param {*} model 
     * @returns {Promise<UserResult>}
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
     * @param {string} username 
     * @returns {Promise<UserResult>}
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
    /**
     * 
     * @param {any} user 
     * @returns {Promise<UserResult>}
     */
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
     * @param {any} userId 
     * @param {object} payload 
     * @returns {Promise<UserResult>}
     */
    async updateUserProfile(userId, payload) {
        try {
            if (!userId || !payload || !Object.keys(payload).length) {
                return { success: false, error: 'Invalid request' }
            }
            if (payload.password) {
                const password = Buffer.from(payload.password, 'base64').toString('utf-8');
                const salt = await bcrypt.genSalt(parseInt(String(app.pwdRounds || 10)));
                payload.password = await bcrypt.hash(password, salt);
            }
            let { success, error, user } = await this.userRespository.update(userId, payload);
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