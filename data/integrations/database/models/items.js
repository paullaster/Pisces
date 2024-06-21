import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Products from "./product.js";
import Cart from "./cart.js";

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
Item.belongsTo(Cart);

Products.hasMany(Item, {
    foreignKey: 'pid',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Item.belongsTo(Products);

Item.sync();


export default Item;