'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Product extends Model {
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
      this.hasMany(models.Image, {
        foreignKey: 'imagableId',
        constraints: false,
        scope: {
          imagableType: 'Product',
        }
      })
      this.belongsTo(models.Category, {
        foreignKey: {
          name: 'category',
          allowNull: false,
        }
      })
    }
  }
  Product.init({
    pid: DataTypes.STRING,
    name: DataTypes.STRING,
    discountedPrice: DataTypes.DeCIMAL,
    price: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    color: DataTypes.STRING,
    size: DataTypes.STRING,
    discount: DataTypes.DECIMAL,
    lastPid: DataTypes.STRING,
    recipeTips: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};