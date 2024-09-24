import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const ItemItemable = sequelize.define('ItemItemable', {
    itemId: {
        type: DataTypes.STRING,
        unique: 'ii_unique_constraint',
    },
    itemableId: {
        type: DataTypes.STRING,
        unique: 'ii_unique_constraint',
    },
    itemableType: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'ii_unique_constraint',
    }
},
{
    tableName: 'item_itemable',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

ItemItemable.sync();

export default ItemItemable;