'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class CartItem extends Model {
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
      this.belongsTo(models.Cart, {
        foreignKey: {
          name: 'cartId',
          allowNull: false,
        }
      });
      this.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        }
      })
    }
  }
  CartItem.init({
    itemId: { type: DataTypes.STRING, primaryKey: true },
    cartId: DataTypes.STRING(255),
    variantId: DataTypes.BIGINT,
    price: DataTypes.DECIMAL(10, 2),
    name: DataTypes.STRING(255),
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CartItem',
    timestamps: false,
  });
  return CartItem;
};