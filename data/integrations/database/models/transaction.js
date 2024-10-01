import { sequelize } from "../connection.js";
import { DataTypes } from "sequelize";

const Transaction = sequelize.define('Transaction',{
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
        unique: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transactionID: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        values: ['Pending', 'Completed', 'Failed'],
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
        values: ['Mpesa', 'Bank Card'],
        unique: false,
    },
},
{
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
});

Transaction.sync();


export default Transaction;