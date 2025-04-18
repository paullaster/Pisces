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
    otp: DataTypes.STRING,
    type: DataTypes.STRING,
    expireAt: DataTypes.DATE,
    used: DataTypes.BOOLEAN,
    usedAt: DataTypes.DATE,
    requestingDevice: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Otp',
    tableName: 'one_time_passwords'
  });
  return Otp;
};