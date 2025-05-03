import { UserRepository } from "../../core/app/user.interface.js";
import { User } from "../../core/types/user.js";
import { Op } from "sequelize";

/**
 * Repository class for handling user operations using Sequelize ORM
 * @class
 * @extends UserRepository
 * @param {Object} UserModel - Sequelize model for User
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing success status and user data or error
 */
export class SequelizeUserRespository extends UserRepository {
    /**
     * @param {*} UserModel - Sequelize Model instance
     */
    constructor(UserModel) {
        super();
        this.dataSource = UserModel;
        this.mapToUser = this.mapToUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createTempCustomer = this.createTempCustomer.bind(this);
        this.create = this.create.bind(this);
        this.userPassword = null;
        this.verifyOTP = this.verifyOTP.bind(this);
    }
    /**
     * 
     * @param {*} id 
     * @param {*} associatedModels 
     * @param {*} eagerLoad 
     * @returns 
     */
    async getUserById(id, associatedModels = [], eagerLoad = false) {
        try {
            let user;
            if (eagerLoad) {
                user = await this.dataSource.findByPk(id, { include: associatedModels });
            } else {
                user = await this.dataSource.findByPk(id);
            }
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            return this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {string} username 
     * @returns 
     */
    async getUserByUsername(username) {
        try {
            const user = await this.dataSource.findOne({ where: { [Op.or]: [{ email: username }, { phoneNumber: username }] } });
            if (!user) {
                return { success: false, error: 'Invalid username' };
            }
            this.userPassword = user['dataValues']['password'];
            return this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} email 
     * @returns 
     */
    async getUserByEmail(email) {
        try {
            let user = await this.dataSource.findOne({ where: { email } });
            if (!user) {
                return { success: false, error: 'Invalid email or username' };
            }
            const { password, ...rest } = user['dataValues']
            this.password = password;
            return this.mapToUser(rest);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} user 
     * @param {*} model 
     * @returns 
     */
    async getUserAssociations(user, model) {
        try {
            const result = await this.getUserById(user, model, true);
            if (!result.success) {
                return { success: false, error: result.error };
            }
            if (!('user' in result) || !result.user) {
                return { success: false, error: 'User not found' };
            }
            return { data: result.user, success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} payload 
     * @returns 
     */
    async create(payload) {
        try {
            const user = await this.dataSource.create(payload);
            return this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} payload 
     * @param {*} model 
     * @returns 
     */
    async createTempCustomer(payload, model) {
        try {
            const newUser = {};
            if (payload?.type === 'email') {
                newUser['email'] = payload.value;
            }
            if (payload?.type === 'phone') {
                newUser['phoneNumber'] = payload.value;
            }
            if (Object.keys(newUser).length) {
                const user = await this.dataSource.create(newUser);
                if (!user) return { success: false, error: 'User not created!' }
                return this.mapToUser(user);
            } else {
                return { success: false, error: 'Invalid payload!' };
            }
        } catch (error) {
            console.log(error)
            const user = await this.dataSource.findOne({
                where: {
                    [Op.or]: [{ email: payload.value }, { phoneNumber: payload.value }]  // check for existing user with same email or phone number
                },
            })
            if (user) {
                await user.destroy();
            }
            return { sucess: false, error: error.message };
        }
    }
    async verifyOTP(options, model) {
        try {
            const user = await this.dataSource.findOne({
                where: {
                    [Op.or]: [{ email: options.username }, { phoneNumber: options.username }]
                },
                include: {
                    model: model,
                    where: {
                        otp: options.otp,
                        expireAt: { [Op.gte]: new Date() },
                        used: false
                    },
                }
            });
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            const otpModel = user.dataValues.Otps[0];
            await user.update({ veryfied: true, completed: true, email_verified_at: new Date() });
            await otpModel.update({ used: true, usedAt: new Date() });
            return { success: true, user: this.mapToUser(user) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async update(user, obj) {
        try {
            const result = await this.dataSource.update(obj, { where: { [Op.or]: [{ email: user }, { phoneNumber: user }] } });
            console.log(result);
            if (!result[0]) {
                return { success: false, error: 'User not found' };
            }
            return { success: true, user: this.mapToUser(result) };
        } catch (error) {
            return { sucess: false, error: error.message };
        }
    }
    async delete(keyVal) {
        try {
            await this.dataSource.findByPk(keyVal);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {Object} user 
     * @returns Promise<Object>
     */
    /**
     * Maps a database user object to a User domain model
     * @param {import("../../core/types/user.js").User} user - The user object from database
     * @returns {Promise<{success: boolean, user?: User, error?: string}>} Mapped user object or error
     */
    async mapToUser(user) {
        try {
            return { success: true, user: new User(user['dataValues']) };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}