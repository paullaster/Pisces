'use strict';
import { Model } from 'sequelize';

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Address extends Model {
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
          name: 'userId',
          allowNull: false,
        }
      });
    }
  }
  Address.init({
    addressId: DataTypes.STRING,
    street: DataTypes.STRING,
    streetCode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    zip: DataTypes.STRING,
    address: DataTypes.STRING,
    default: DataTypes.BOOLEAN,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    appartment: DataTypes.STRING,
    town: DataTypes.STRING,
    placeId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};