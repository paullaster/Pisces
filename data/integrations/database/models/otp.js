'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
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
  });
  return Otp;
};