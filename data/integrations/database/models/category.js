import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const Category  = sequelize.define('Category',{
    cid: {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    lastCid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
}, {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Category.sync();

export default Category;