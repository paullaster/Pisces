'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FailedTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FailedTransaction.init({
    transId: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    checkoutId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    transactionID: DataTypes.STRING,
    status: DataTypes.STRING,
    transactionDate: DataTypes.DATE,
    transactionMessage: DataTypes.STRING,
    merchantRequestID: DataTypes.STRING,
    checkoutRequestID: DataTypes.STRING,
    paymentMethod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FailedTransaction',
  });
  return FailedTransaction;
};