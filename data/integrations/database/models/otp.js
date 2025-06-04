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
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        }
      })
    }
  }
  Otp.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    userId: DataTypes.BIGINT,
    otp: DataTypes.STRING,
    purpose: { type: DataTypes.ENUM('newAccount', 'passwordReset'), defaultValue: 'newAccount' },
    expiryTime: DataTypes.DATE,
    isUsed: { type: DataTypes.BOOLEAN, defaultValue: false, },
  }, {
    sequelize,
    modelName: 'Otp',
    tableName: 'one_time_passwords',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['otp', 'purpose', 'expiryTime', 'isUsed'],
      },
      {
        unique: false,
        fields: ['userId'],
        name: 'idx_userId',
      }
    ],
  });
  return Otp;
};