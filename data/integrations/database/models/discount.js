'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Discount extends Model {
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
      this.belongsToMany(models.Product, {
        through: models.ProductDiscount,
        foreignKey: 'discountId',
        otherKey: 'productId',
      })
      this.hasMany(models.ProductDiscount, {
        foreignKey: 'discountId'
      })
    }
  }
  Discount.init({
    title: DataTypes.STRING,
    code: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    type: DataTypes.ENUM('Percentage', 'Fixed'),
    usageLimit: DataTypes.INTEGER,
    startPublishing: DataTypes.DATE,
    endPublishing: DataTypes.DATE,
    status: DataTypes.ENUM('Published', 'UnPublished')
  }, {
    sequelize,
    modelName: 'Discount',
  });
  return Discount;
};