'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class ProductDiscount extends Model {
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
        foreignKey: 'discountId',
      })
      this.belongsTo(models.Product, {
        foreignKey: 'productId',
      })
    }
  }
  ProductDiscount.init({
  }, {
    sequelize,
    modelName: 'ProductDiscount',
  });
  return ProductDiscount;
};