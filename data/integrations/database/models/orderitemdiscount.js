'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class OrderItemDiscount extends Model {
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
      this.belongsTo(models.Discount, {
        foreignKey: {
          name: 'discountId',
          allowNull: false,
        },
      });
      this.belongsTo(models.OrderItem, {
        foreignKey: {
          name: 'orderItemId',
          allowNull: false,
        }
      })
    }
  }
  OrderItemDiscount.init({
    orderItemDiscountId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    orderItemId: DataTypes.STRING(255),
    discountId: DataTypes.BIGINT,
    discountAmount: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'OrderItemDiscount',
    timestamps: false,
  });
  return OrderItemDiscount;
};