'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Otp extends Model {
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
    }
  }
  Otp.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    otp: DataTypes.STRING,
    type: DataTypes.STRING,
    expireAt: DataTypes.DATE,
    used: DataTypes.BOOLEAN,
    usedAt: DataTypes.DATE,
    requestingDevice: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Otp',
    tableName: 'one_time_passwords',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['otp', 'type', 'expireAt', 'used'],
      },
    ],
  });
  return Otp;
};