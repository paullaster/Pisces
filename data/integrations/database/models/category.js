import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Image from "./images.js";


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
        unique: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
}, {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});


Category.hasMany(Image, {
    foreignKey: 'imagableId',
    constraints: false,
    // scope: {
    //     imagableType: 'Category'
    // }
});


Image.belongsTo(Category, {
    foreignKey: 'imagableId',
    constraints: false,
})

Category.sync();

export default Category;