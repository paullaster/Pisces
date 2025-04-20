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
      });
      this.belongsToMany(models.OrderItem, {
        through: models.OrderItemDiscount,
        foreignKey: {
          name: 'discountId',
          allowNull: false,
        },
        otherKey: {
          name: 'orderItemId',
          allowNull: false,
        },
      });
      this.hasMany(models.ProductDiscount, {
        foreignKey: 'discountId'
      });
      this.hasMany(models.OrderItemDiscount, {
        foreignKey: {
          name: 'discountId',
          allowNull: false,
        }
      })
    }
  }
  Discount.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    code: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    type: DataTypes.ENUM('Percentage', 'Fixed'),
    usageLimit: DataTypes.INTEGER,
    startPublishing: DataTypes.DATE,
    endPublishing: DataTypes.DATE,
    status: DataTypes.ENUM('Published', 'UnPublished'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Discount',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['title'],
        type: 'FULLTEXT',
        name: 'idx_title',
      },
      {
        unique: false,
        fields: ['amount'],
        name: 'idx_amount',
      },
      {
        unique: false,
        fields: ['type'],
        name: 'idx_type',
      },
    ],
  });
  return Discount;
};