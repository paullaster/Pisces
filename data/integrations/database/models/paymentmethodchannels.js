'use strict';

import { Model } from 'sequelize';
export default function (sequelize, DataTypes) {
  class PaymentMethodChannel extends Model {
    static associate(models) {
      this.hasMany(models.PaymentMethod, {
        sourceKey: 'id',
        foreignKey: {
          name: 'channeId',
          allowNull: false,
        }
      });
    }
  }
  PaymentMethodChannel.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    code: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaymentMethodChannel',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['code'],
      },
    ]
  });
  return PaymentMethodChannel;
};