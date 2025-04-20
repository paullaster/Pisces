'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class PaymentMethod extends Model {
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
      this.hasMany(models.Transaction, {
        foreignKey: {
          name: 'paymentMethodId',
          allowNull: false,
        }
      })
    }
  }
  PaymentMethod.init({
    methodId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(50),
    channel: DataTypes.ENUM('B2C_STK_PUSH', 'C2B', 'B2C_RTG'),
    type: DataTypes.ENUM('CARD', 'MOBILE_MONEY', 'OTHER'),
    provider: DataTypes.STRING(200),
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['name', 'channel', 'type'],
      },
    ],
  });
  return PaymentMethod;
};