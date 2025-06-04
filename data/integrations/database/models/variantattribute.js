'use strict';
import { Model } from "sequelize";

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class VariantAttribute extends Model {
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
      this.belongsTo(models.ProductVariant, {
        foreignKey: {
          name: 'variantId',
          allowNull: false,
        },
      });
      this.belongsTo(models.AttributeValue, {
        foreignKey: {
          name: 'valueId',
          allowNull: false,
        },
      });
    }
  }
  VariantAttribute.init({
    variantAttributeId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    variantId: DataTypes.STRING,
    valueId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VariantAttribute',
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['variantId'],
        name: 'idx_variantId',
      },
      {
        unique: false,
        fields: ['valueId'],
        name: 'idx_valueId',
      },
    ],
  });
  return VariantAttribute;
};