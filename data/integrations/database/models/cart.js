import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Products from "./product.js";
import User from "./users.js";

const Cart = sequelize.define('Cart',{
    cartId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    itemPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
    itemDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    itemImage: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    itemId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: Products,
            key: 'pid',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
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
    itemQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    itemColor: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    itemSize: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    itemCheckoutStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'New',
        values: ['New', 'Paid'],
        // , 'Pending Processing','Processed', 'Pending Delivery', 'Delivered',
    }
},
{
    tableName: 'carts',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Cart.sync();


export default Cart;