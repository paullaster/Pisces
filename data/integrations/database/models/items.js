import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Product from "./product.js";

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
        type: DataTypes.DOUBLE,
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
    Images: {
        type: DataTypes.JSON,
        allowNull: false,
        unique: false,
    }
},
{
    tableName: 'items',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Item.prototype.getItemables = async function (options) {
    const carts = await this.getCarts(options);
    const orders = await this.getOrders(options);
    return [...carts,...orders];
}

Product.hasMany(Item, {
    foreignKey: 'productId',
    constraints: false,
});
Item.belongsTo(Product, {
    foreignKey: 'productId',
    constraints: false,
});

Item.sync();


export default Item;