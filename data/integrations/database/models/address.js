import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";

const Address = sequelize.define('Address',{
    addressId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'email'
        }
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    streetCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 0,
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 0,
    },
    appartment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
}
);

Address.sync();

export default Address;