'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class ProductVariant extends Model {
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
      this.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          allowNull: false,
        }
      });
      this.belongsToMany(models.AttributeValue, {
        through: models.VariantAttribute,
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        },
        otherKey: {
          name: 'valueId',
          allowNull: false,
        },
      });
      this.hasMany(models.CartItem, {
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        }
      });
      this.hasMany(models.OrderItem, {
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        }
      });
      this.hasMany(models.VariantAttribute, {
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        }
      });
    }
  }
  ProductVariant.init({
    variantId: DataTypes.BIGINT,
    productId: DataTypes.STRING(255),
    sku: DataTypes.STRING(255),
    price: DataTypes.DECIMAL(10, 2),
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ProductVariant',
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['productId'],
        name: 'idx_productId',
      },
      {
        unique: true,
        fields: ['sku'],
        name: 'idx_sku',
      },
    ],
  });
  return ProductVariant;
};