import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import User from "./users.js";
import ItemItemable from "./ITEM_ITEMABLE.js";
import Item from "./items.js";

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


Cart.belongsTo(Item, {
    through: {
        model: ItemItemable,
        unique: false,
        scope: {
            itemableType: 'Cart',
        },
    },
    foreignKey: 'itemableId',
    constraints: false,
});

Item.belongsToMany(Cart, {
    through: {
        model: ItemItemable,
        unique: false,
    },
    foreignKey: 'itemId',
    constraints: false,
});

User.hasOne(Cart, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Cart.belongsTo(User);

Cart.sync();


export default Cart;