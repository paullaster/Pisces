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
    addressId: { type: DataTypes.STRING(255), primaryKey: true },
    userId: DataTypes.STRING(255),
    street: DataTypes.STRING(255),
    streetCode: DataTypes.STRING(255),
    city: DataTypes.STRING(255),
    country: DataTypes.STRING(255),
    zip: DataTypes.STRING(255),
    address: DataTypes.TEXT,
    default: DataTypes.BOOLEAN,
    latitude: DataTypes.DECIMAL(10, 6),
    longitude: DataTypes.DECIMAL(10, 6),
    appartment: DataTypes.STRING(255),
    town: DataTypes.STRING(255),
    placeId: DataTypes.STRING(255),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Address',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['city', 'town', 'street'],
        name: 'city_town_street',
      },
      {
        unique: false,
        fields: ['userId'],
        name: 'idx_userId'
      }
    ]
  });
  return Address;
};