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
    shippingRate: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Cash On Delivery'
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'New',
        values: ['New', 'Pending Processing', 'Processed', 'Pending Delivery', 'Delivered'],
    },
    originCart: {
        type: DataTypes.STRING,
        allowNull: true,
    },
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

Order.sync();

export default Order;