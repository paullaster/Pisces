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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: Image,
            key: 'imgid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
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