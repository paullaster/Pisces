'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class DeliveryLocation extends Model {
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
      this.belongsTo(models.Warehouse, {
        foreignKey: {
          name: 'warehouseId',
          allowNull: false,
        }
      })
    }
  }
  DeliveryLocation.init({
    locationId: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    warehouseId: DataTypes.BIGINT,
    destination: DataTypes.JSON,
    distanceMeters: DataTypes.INTEGER,
    durationSeconds: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'DeliveryLocation',
    timestamps: true,
    indexes: [

      {
        unique: false,
        fields: ['warehouseId'],
        name: 'idx_warehouseId',
      },
      {
        unique: false,
        fields: ['distanceMeters'],
        name: 'idx_distanceMeters',
      },
      {
        unique: false,
        fields: ['durationSeconds'],
        name: 'idx_durationSeconds',
      },
    ],
  });
  return DeliveryLocation;
};