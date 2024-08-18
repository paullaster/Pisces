import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";
const Otp = sequelize.define('Otp', {
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('newAccount', 'passwordReset'),
        defaultValue: 'newAccount'
    },
    expireAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    requestingDevice: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'one_time_passwords',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

User.hasMany(Otp, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Otp.belongsTo(User,{
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Otp.sync();

export default Otp;