import { UserRepository } from "../../core/app/user.interface.js";
import { User } from "../../core/types/user.js";
import { Op } from "sequelize";

/** @typedef {import('../../core/types/user.result.jsdoc.js').UserResult}  UserResult*/
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
    }
    /**
     * 
     * @param {*} id 
     * @param {*} associatedModels 
     * @param {*} eagerLoad 
     * @returns {Promise<UserResult>}
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
            const mappedUser = await this.mapToUser(user);
            return mappedUser
        } catch (error) {
            return { success: false, error: error.message };
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
            const user = await this.dataSource.findOne({ where: { [Op.or]: [{ email: username }, { phoneNumber: username }] }, include: model });
            if (!user) {
                return { success: false, error: 'Invalid username' };
            }
            this.userPassword = user['dataValues']['password'];
            return await this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} email 
     * @returns {Promise<UserResult>}
     */
    async getUserByEmail(email) {
        try {
            let user = await this.dataSource.findOne({ where: { email } });
            if (!user) {
                return { success: false, error: 'Invalid email or username' };
            }
            const { password, ...rest } = user['dataValues']
            this.password = password;
            return await this.mapToUser(rest);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} user 
     * @param {*} model 
     * @returns {Promise<UserResult>}
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
            return { user: result.user, success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} payload 
     * @returns {Promise<UserResult>}
     */
    async create(payload) {
        try {
            const user = await this.dataSource.create(payload);
            return await this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {*} payload 
     * @param {*} model 
     * @returns {Promise<UserResult>}
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
            return { success: false, error: error.message };
        }
    }
    /**
     * 
     * @param {any} userId 
     * @param {object} update 
     * @returns Promise{ UserResult}
     */
    async update(userId, update) {
        try {
            const result = await this.dataSource.update(update, { where: { id: userId } });
            if (!result[0]) {
                return { error: 'User not found', success: false };
            }
            return { success: true };
        } catch (error) {
            return { error: error.message, success: false }
        }
    }
    /**
     * 
     * @param {any} keyVal 
     * @returns {Promise<UserResult>}
     */
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
     * @returns {Promise<UserResult>} Mapped user object or error
     */
    async mapToUser(user) {
        try {
            return { success: true, user: new User(user['dataValues']) };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}