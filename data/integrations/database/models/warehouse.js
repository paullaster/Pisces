'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Warehouse extends Model {
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
      this.hasMany(models.DeliveryLocation, {
        foreignKey: {
          name: 'warehouseId',
          allowNull: false,
        },
      })
    }
  }
  Warehouse.init({
    warehouseId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    warehouseName: DataTypes.STRING(255),
    location: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Warehouse',
    timestamps: false,
  });
  return Warehouse;
};