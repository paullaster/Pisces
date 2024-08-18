import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Otp from "./user.one.time.passwords.js";

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('customer', 'admin'),
        defaultValue: 'customer'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_verified_at: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    veryfied: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

User.sync();

export default User;