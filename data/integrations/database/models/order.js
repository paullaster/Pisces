import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";
import Item from "./items.js";
import ItemItemable from "./ITEM_ITEMABLE.js";

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

Order.belongsToMany(Item, {
    through: {
        model: ItemItemable,
        unique: false,
        scope: {
            itemableType: 'Order',
        },
    },
    foreignKey: 'itemableId',
    constraints: false,
});

Item.belongsToMany(Order, {
    through: {
        model: ItemItemable,
        unique: false,
    },
    foreignKey: 'itemId',
    constraints: false,
});

User.hasMany(Order, {
    foreignKey: 'userId',
});
Order.belongsTo(User);

Order.sync();

export default Order;