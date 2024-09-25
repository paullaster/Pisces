import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";

const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'New',
        values: ['New', 'Pending Processing', 'Processed', 'Pending Delivery', 'Delivered'],
    }
},
    {
        tableName: 'orders',
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

Order.belongsTo(User, { targetKey: 'email', foreignKey: 'userEmail' });

Order.sync({force: true});

export default Order;