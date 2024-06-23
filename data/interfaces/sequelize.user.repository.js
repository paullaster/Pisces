import { UserRepository } from "../../core/app/user.interface.js";
import { User } from "../../core/types/user.js";
import { Op } from "sequelize";

export class SequelizeUserRespository extends UserRepository {
    constructor(UserModel) {
        super();
        this.dataSource = UserModel;
        this.mapToUser = this.mapToUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.password = null;
    }
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
    async getUserByUsername(username) {
        try {
            const user = await this.dataSource.findOne({ where: { [Op.or]: [{username: username}, {email: username}, {phoneNumber: username}] } });
            if (!user) {
                return { sucess: false, error: 'Invalid username' };
            }
            const { password, ...rest } = user['dataValues']
            this.password = password;
            return this.mapToUser(rest);
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
            const { data, success, error } = await this.getUserById(user, model, true);
            if (!success) {
                return { success: false, error };
            }
            return this.mapToUser(data);
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
    async update(user) {
        try {
            await this.dataSource.update(user, { where: { email: user.email } });
            return this.mapToUser(user);
        } catch (error) {
            return { sucess: false, error: error.message };
        }
    }
    async delete(email) {
        try {
            await this.dataSource.destroy({ where: { email } });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    mapToUser(user) {
        try {
            const { email, username, ...rest } = user;
            return { success: true, user: new User(username, email, rest) };
        } catch (error) {
            return { success: false, error: error.message}
        }
    }
}