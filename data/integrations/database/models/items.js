import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Product from "./product.js";
import Cart from "./cart.js";
import Order from "./order.js";

const Item = sequelize.define('Item',{
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
},
{
    tableName: 'items',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Cart.hasMany(Item, {
    foreignKey: 'cartId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Item.belongsTo(Cart, {
    foreignKey: 'cartId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Product.hasMany(Item, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Item.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Order.hasMany(Item, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Item.belongsTo(Order, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Item.sync();


export default Item;