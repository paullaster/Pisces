'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class OrderItem extends Model {
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
      this.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        }
      });
      this.belongsToMany(models.Discount, {
        through: models.OrderItemDiscount,
        foreignKey: {
          name: 'orderItemId',
          allowNull: false,
        },
        otherKey: {
          name: 'discountId',
          allowNull: false,
        }
      });
      this.hasMany(models.OrderItemDiscount, {
        foreignKey: {
          name: 'orderItemId',
          allowNull: false,
        }
      })
    }
  }
  OrderItem.init({
    itemId: { type: DataTypes.STRING, primaryKey: true },
    orderId: DataTypes.STRING(255),
    variantId: DataTypes.BIGINT,
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DeCIMAL(10, 6),
    subtotal: DataTypes.DECIMAL(10, 6),
  }, {
    sequelize,
    modelName: 'OrderItem',
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['orderId'],
        name: 'idx_orderId',
      },
      {
        unique: false,
        fields: ['variantId'],
        name: 'idx_variantId',
      },
    ],
  });
  return OrderItem;
};