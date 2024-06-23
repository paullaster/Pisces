import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const Notification = sequelize.define('Notification',{
    notficationdId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    readStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
},
{
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Notification.sync();

export default Notification;