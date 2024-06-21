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
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: User,
            key: 'email',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
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

Order.sync();

export default Order;