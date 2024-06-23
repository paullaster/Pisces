import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";

const Cart = sequelize.define('Cart',{
    cartId: {
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
        values: ['New', 'Paid'],
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

User.hasMany(Cart, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Cart.belongsTo(User);

Cart.sync();


export default Cart;