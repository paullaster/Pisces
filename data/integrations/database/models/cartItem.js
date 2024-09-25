import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Product from "./product.js";
import Cart from "./cart.js";


const CartItem = sequelize.define('CartItem',{
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
    productPid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: Product,
            key: 'pid',
        },
    },
    cartCartId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    }


},
{
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});
// Product.belongsToMany(Cart, {
//     through: CartItem,
// });
// Cart.belongsToMany(Product, {
//     through: CartItem,
// });

CartItem.sync();


export default CartItem;