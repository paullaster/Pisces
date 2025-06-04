'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Category extends Model {
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
          imagableType: 'Category',
        },
      })
      this.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: 'categoryId',
        otherKey: 'productId',
      })
      this.hasMany(models.ProductCategory, {
        foreignKey: {
          name: 'categoryId',
          allowNull: false,
        }
      })
    }
  }
  Category.init({
    cid: { type: DataTypes.STRING(255), primaryKey: true },
    name: DataTypes.STRING(100),
    description: DataTypes.STRING(255),
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    color: DataTypes.STRING(255),
    icon: DataTypes.STRING(255),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true,
  });
  return Category;
};