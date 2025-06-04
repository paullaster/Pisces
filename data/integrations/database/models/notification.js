'use strict';
import { Model } from "sequelize";
/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  class Notification extends Model {
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
        foreignKey: {
          name: 'userId',
          allowNull: false,
        }
      });
    }
  }
  Notification.init({
    notficationdId: { type: DataTypes.STRING(255), primaryKey: true },
    userId: DataTypes.BIGINT,
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
      {
        unique: false,
        fields: ['userId'],
        name: 'idx_userId',
      },
    ],
  });
  return Notification;
};