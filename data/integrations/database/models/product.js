import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";
import Category from "./category.js";

const Products = sequelize.define('Product',{
    pid: {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        references: {
            model: Category,
            key: 'cid',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
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
    lastPid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    }
},
{
    tableName: 'products',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Products.sync();


export default Products;