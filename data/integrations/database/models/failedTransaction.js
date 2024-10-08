import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const FailedTransaction = sequelize.define('FailedTransaction',{
    transId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    checkoutId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Failed',
        values: ['Failed'],
        allowNull: false,
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull:true,
    },
    transactionMessage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    merchantRequestID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    checkoutRequestID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Mpesa',
        values: ['Cash On Delivery', 'Mpesa', 'Bank Card'],
        unique: false,
    },
},
{
    tableName: 'failed_transaction',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

FailedTransaction.sync();


export default FailedTransaction;