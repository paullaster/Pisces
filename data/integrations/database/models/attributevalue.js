'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class AttributeValue extends Model {
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
      this.belongsToMany(models.ProductVariant, {
        through: models.VariantAttribute,
        foreignKey: {
          name: 'valueId',
          allowNull: false,
        },
        otherKey: {
          name: 'variantId',
          allowNull: false,
        },
      });
      this.belongsTo(models.Attribute, {
        foreignKey: {
          name: 'attributeId',
          allowNull: false,
        },
      });
      this.hasMany(models.VariantAttribute, {
        foreignKey: {
          name: 'valueId',
          allowNull: false,
        },
      });
    }
  }
  AttributeValue.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    attributeId: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AttributeValue',
    timestamps: false,
    indexes: [
      {
        unique: false,
        fields: ['attributeId'],
        name: 'idx_attributeId',
      },
      {
        unique: false,
        fields: ['value'],
        name: 'idx_value',
      }
    ],
  });
  return AttributeValue;
};