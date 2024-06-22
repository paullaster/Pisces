import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";
import Item from "./items.js";

const Order = sequelize.define('Order',{
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    cartCheckoutStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'New',
        values: ['Pending Processing','Processed', 'Pending Delivery', 'Delivered'],
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

Order.hasMany(Item, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Item.belongsTo(Order);

User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Order.belongsTo(User);

Order.sync();

export default Order;