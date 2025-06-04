'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    /**
     * 
     * @param {*} models 
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Order, {
        foreignKey: {
          name: 'orderId',
          allowNull: false,
        }
      });
      this.belongsTo(models.PaymentMethod, {
        foreignKey: {
          name: 'paymentMethodId',
          allowNull: false,
        }
      })
    }
  }
  Transaction.init({
    transId: { type: DataTypes.STRING(255), primaryKey: true, },
    orderId: DataTypes.STRING(255),
    paymentMethodId: DataTypes.BIGINT,
    amount: DataTypes.DECIMAL(10, 2),
    transactionID: DataTypes.STRING(255),
    status: DataTypes.ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
    metadata: DataTypes.JSON,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: false,
        fields: ['status'],
        name: 'idx_status'
      },
      {
        unique: false,
        fields: ['amount'],
        name: 'idx_amount',
      },
      {
        unique: false,
        fields: ['paymentMethodId'],
        name: 'idx_paymentMethodId'
      },
      {
        unique: false,
        fields: ['orderId'],
        name: 'idx_orderId',
      }
    ]
  });
  return Transaction;
};