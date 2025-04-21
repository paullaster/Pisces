'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Order extends Model {
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
      this.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: {
          name: 'userId',
          allowNull: false,
        }
      });
      this.hasMany(models.OrderItem, {
        foreignKey: {
          name: 'orderId',
          allowNull: false,
        }
      });
      this.hasMany(models.Transaction, {
        foreignKey: {
          name: 'orderId',
          allowNull: false,
        }
      });
      this.belongsTo(models.Transaction, {
        foreignKey: {
          name: 'paymentId',
          allowNull: true,
        }
      });
    }
  }
  Order.init({
    orderId: { type: DataTypes.STRING, primaryKey: true },
    userId: DataTypes.BIGINT,
    paymentId: DataTypes.STRING(255),
    status: DataTypes.ENUM('New', 'Pending Processing', 'Processed', 'Pending Delivery', 'Delivered', 'Cancelled', 'In Transit'),
    deliveryFee: DataTypes.DECIMAL(10, 2),
    totalAmount: DataTypes.DECIMAL(10, 2),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: false,
        fields: ['createdAt'],
        name: 'idx_createdAt',
      },
      {
        unique: false,
        fields: ['status'],
        name: 'idx_status',
      },
      {
        unique: false,
        fields: ['totalAmount'],
        name: 'idx_totalAmount',
      },
      {
        unique: false,
        fields: ['userId'],
        name: 'idx_userId',
      },
      {
        unique: false,
        fields: ['paymentId'],
        name: 'idx_paymentId'
      }
    ],
  });
  return Order;
};