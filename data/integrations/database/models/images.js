import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const Image = sequelize.define('Image',{
    imgid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    }
},
{
    tableName: 'images',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
}
);

Image.sync();

export default Image;