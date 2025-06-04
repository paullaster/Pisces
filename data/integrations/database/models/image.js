
'use strict';
import { Model } from "sequelize";
import { uppercasefirst } from "../../../../common/uppercasefirst.js";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Image extends Model {
    /**
     * 
     * @param {*} options 
     * @returns 
     */
    async getImagable(options) {
      if (!this['imagableType']) return Promise.resolve(null);
      const mixinMethodName = `get${uppercasefirst(this['imagableType'])}`;
      return this[mixinMethodName](options);
    }
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
      this.belongsTo(models.Category, {
        constraints: false,
        foreignKey: 'imagableId'
      })
      this.belongsTo(models.Product, {
        foreignKey: 'imagableId',
        constraints: false,
      })
    }
  }
  Image.init({
    imgId: { type: DataTypes.STRING(255), primaryKey: true },
    imagableId: DataTypes.STRING(255),
    imagableType: DataTypes.STRING(255),
    mimetype: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  Image.addHook('afterFind', (findResult) => {
    if (!findResult) return;
    const results = !Array.isArray(findResult) ? [findResult] : findResult;
    for (const instance of results) {
      if (instance.imagableType === 'Product' && instance.Product !== undefined) {
        instance.imagable = instance.product;
      } else if (instance.imagableType === 'Category' && instance.Category !== undefined) {
        instance.imagable = instance.category;
      }
      delete instance.Product;
      delete instance.dataValues.Product;
      delete instance.Category;
      delete instance.dataValues.Category;
    }
  })
  return Image;
};