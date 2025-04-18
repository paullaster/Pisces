'use strict';
import { Model } from 'sequelize';

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class User extends Model {
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
      this.hasMany(models.Order, {
        sourceKey: 'email',
        foreignKey: {
          name: 'userId',
          allowNull: false,
        }
      });
      this.hasMany(models.Address, {
        sourceKey: 'email',
        foreignKey: {
          name: 'userId',
          allowNull: false,
        }
      });
      this.belongsToMany(models.Role, {
        through: 'UserRoles',
      });
      models.Role.belongsToMany(this, {
        through: 'UserRoles',
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    email_verified_at: DataTypes.DATE,
    veryfied: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN,
    type: DataTypes.ENUM('customer', 'admin')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};