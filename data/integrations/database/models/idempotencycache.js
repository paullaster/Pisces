'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class IdempotencyCache extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IdempotencyCache.init({
    key: {
      primaryKey: true,
      type: DataTypes.STRING(255),
    },
    status: DataTypes.ENUM('Pending', 'Completed', 'Failed')
  }, {
    sequelize,
    modelName: 'IdempotencyCache',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['key'],
      },
    ]
  });
  return IdempotencyCache;
};