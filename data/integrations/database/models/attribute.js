'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Attribute extends Model {
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
      this.hasMany(models.AttributeValue, {
        foreignKey: {
          name: 'attributeId',
          allowNull: false,
        },
      });
    }
  }
  Attribute.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attribute',
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['name'],
        name: 'idx_name',
      },
    ],
  });
  return Attribute;
};