'use strict';
const {
  Model
} = require('sequelize');

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class ProductCategory extends Model {
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
      this.belongsTo(models.Category, {
        foreignKey: {
          name: 'categoryId',
          allowNull: false,
        }
      })
      this.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      })
    }
  }
  ProductCategory.init({
  }, {
    sequelize,
    modelName: 'ProductCategory',
  });
  return ProductCategory;
};