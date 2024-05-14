import { UserRepository } from "../../core/app/user.interface.js";
import { User } from "../../core/types/user.js";

export class SequelizeUserRespository extends UserRepository {
    constructor(UserModel) {
        super();
        this.dataSource = UserModel;
        this.mapToUser = this.mapToUser.bind(this);
        this.password =  null;
    }
    async getUserById(id) {
        const user = await this.dataSource.findByPk(id);
        return user? this.mapToUser(user) : null;
    }
    async getUserByUsername(username) {
        const user = await this.dataSource.findOne({ where: { username } });
        this.password = user['dataValues'].password;
        return user? this.mapToUser(user) : null;
    }
    async getUserByEmail(email) {
        const user = await this.dataSource.findOne({ where: { email } });
        return user? this.mapToUser(user) : null;
    }
    async create(email, username, password) {
        const user = await this.dataSource.create( {email, username, password});
        return this.mapToUser(user);
    }
    async update(user) {
        await this.dataSource.update(user, { where: { email: user.email } });
        return this.mapToUser(user);
    }
    async delete(email) {
        await this.dataSource.destroy({ where: { email } });
    }
    mapToUser(user) {
        const { email, username } = user;
        return new User(username, email);
    }  
}