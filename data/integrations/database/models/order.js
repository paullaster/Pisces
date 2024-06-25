import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";

const Order = sequelize.define('Order',{
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
        values: ['New','Pending Processing','Processed', 'Pending Delivery', 'Delivered'],
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

User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Order.belongsTo(User);

Order.sync();

export default Order;