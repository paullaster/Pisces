import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

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
        type: DataTypes.STRING,
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
        unique: false
    },
    quantity: {
        type: DataTypes.STRING,
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