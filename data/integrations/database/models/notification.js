'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    notficationdId: { type: DataTypes.STRING(255), primaryKey: true },
    read: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Notification',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['read'],
      },
    ],
  });
  return Notification;
};