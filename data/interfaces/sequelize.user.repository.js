import { UserRepository } from "../../core/app/user.interface.js";
import { User } from "../../core/types/user.js";
import { DataTypes } from "sequelize";

export class SequelizeUserRespository extends UserRepository {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        const userModel = this.sequelize.define('User', {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'users',
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });
        this.dataSource = userModel;
    }
    async getUserById(id) {
        const user = await this.dataSource.findByPk(id);
        return user? this.mapToUser(user) : null;
    }
    async getUserByUsername(username) {
        const user = await this.dataSource.findOne({ where: { username } });
        return user? this.mapToUser(user) : null;
    }
    async getUserByEmail(email) {
        const user = await this.dataSource.findOne({ where: { email } });
        return user? this.mapToUser(user) : null;
    }
    async update(user) {
        await this.dataSource.update(user, { where: { id: user.id } });
        return this.mapToUser(user);
    }
    async delete(id) {
        await this.dataSource.destroy({ where: { id } });
    }
    mapToUser(user) {
        const { email, username, ...others} = user;
        return new User(username, email, others);
    }  
}