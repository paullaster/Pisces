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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        unique: false,
        defaultValue: 0,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        unique: false,
        defaultValue: 0,
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        unique: false,
        defaultValue: 0,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: Product,
            key: 'pid',
        },
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

Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'Items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
OrderItem.belongsTo(Cart, {foreignKey: 'orderId', onDelete: 'CASECADE', onUpdate: 'CASECADE', constraints: false})
OrderItem.sync();


export default OrderItem;