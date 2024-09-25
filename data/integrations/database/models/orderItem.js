import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Product from "./product.js";
import Order from "./order.js";


const OrderItem = sequelize.define('OrderItem',{
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
},
{
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Product.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'orderId',
    constraints: false,
});
Order.belongsToMany(Product, {
    through: OrderItem,
    foreignKey: 'productId',
    constraints: false,
});

// OrderItem.sync({force: true});


export default OrderItem;