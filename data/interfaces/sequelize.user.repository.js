import { UserRepository } from "../../core/app/user.interface.js";
import { User } from "../../core/types/user.js";
import { Op } from "sequelize";
import { RandomCodeGenerator } from "../../common/generating_unique_codes.js";

export class SequelizeUserRespository extends UserRepository {
    constructor(UserModel) {
        super();
        this.dataSource = UserModel;
        this.mapToUser = this.mapToUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createTempCustomer = this.createTempCustomer.bind(this);
        this.create = this.create.bind(this);
        this.userPassword = null;
    }
    async getUserById(id, associatedModels = [], eagerLoad = false) {
        try {
            let user;
            if (eagerLoad) {
                user = await this.dataSource.findByPk(id, { include: associatedModels });
                user = user['dataValues'];
            } else {
                user = await this.dataSource.findByPk(id);
                user = user['dataValues'];
            }
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            return this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getUserByUsername(username) {
        try {
            const user = await this.dataSource.findOne({ where: { [Op.or]: [{ email: username }, { phoneNumber: username }] } });
            if (!user) {
                return { sucess: false, error: 'Invalid username' };
            }
            this.userPassword = user['dataValues']['password'];
            return this.mapToUser(user);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
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
    async getUserAssociations(user, model) {
        try {
            const { user: data, success, error } = await this.getUserById(user, model, true);
            if (!success) {
                return { success: false, error };
            }
            return { data, success };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    async create(payload) {
        try {
            const user = await this.dataSource.create(payload);
            return this.mapToUser(user);
        } catch (error) {
            return { sucess: false, error: error.message };
        }
    }
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
                const savedOtp = await user.createOtp({
                    otp: RandomCodeGenerator(6, ''),
                    expireAt: new Date(new Date().getTime() + 600000),
                    requestingDevice: payload.requestingDevice,
                });
                
                const refrreshedModel = await user.reload({
                    include: {
                        model: model,
                        where: {
                            type: savedOtp['dataValues']['type'],
                            otp: savedOtp['dataValues']['otp'],
                            expireAt: savedOtp['dataValues']['expireAt'],
                            requestingDevice: savedOtp['dataValues']['requestingDevice'],
                            used: savedOtp['dataValues']['used'],
                        },
                        attributes: ['otp', 'expireAt']
                    }
                });
                return this.mapToUser(refrreshedModel);
            } else {
                return { success: false, error: 'Invalid payload!' };
            }
        } catch (error) {
            const user = await this.dataSource.findOne({
                where: {
                    [Op.or]: [{ email: payload.value }, { phoneNumber: payload.value }]  // check for existing user with same email or phone number
                },
            })
            await user.destroy();
            return { sucess: false, error: error.message };
        }
    }
    async update(user) {
        try {
            await this.dataSource.update(user, { where: { email: user.email } });
            return this.mapToUser(user);
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
    mapToUser(user) {
        try {

            user['dataValues']?.password && delete user['dataValues'].password;
            return { success: true, user: new User(user['dataValues']) };
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}