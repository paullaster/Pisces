'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Cart extends Model {
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
      this.belongsTo(models.User, {
        targetKey: 'email',
        foreignKey: {
          allowNull: false,
          name: 'userId'
        }
      })
      this.hasMany(models.CartItem, {
        foreignKey: {
          name: 'cartId',
          allowNull: false,
        }
      })
    }
  }
  Cart.init({
    cartId: { type: DataTypes.STRING, primaryKey: true },
    userId: DataTypes.BIGINT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Cart',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId']
      }
    ]
  });
  return Cart;
};