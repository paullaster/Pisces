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
      });
      this.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'productId',
        otherKey: 'categoryId',
      });
      this.hasMany(models.ProductCategory, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      this.belongsToMany(models.Discount, {
        through: models.ProductDiscount,
        foreignKey: 'productId',
        otherKey: 'discountId',
      })
      this.hasMany(models.ProductDiscount, {
        foreignKey: 'productId',
      });
      this.hasMany(models.ProductVariant, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
    }
  }
  Product.init({
    pid: DataTypes.STRING,
    name: DataTypes.STRING(255),
    discountedPrice: DataTypes.DECIMAL(10, 2),
    price: DataTypes.DECIMAL(10, 2),
    description: DataTypes.TEXT,
    recipeTips: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['name'],
        type: 'FULLTEXT',
        name: 'idx_name',
      },
      {
        unique: false,
        fields: ['price'],
        name: 'idx_price',
      },
    ],
  });
  return Product;
};