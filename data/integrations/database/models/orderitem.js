'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderItem.init({
    itemId: DataTypes.STRING,
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    image: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    totalPrice: DataTypes.DECIMAL,
    discount: DataTypes.DECIMAL,
    productId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};