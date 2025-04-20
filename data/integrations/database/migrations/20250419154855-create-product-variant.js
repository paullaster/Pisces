'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductVariants', {
      variantId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'pid'
        },
        onDelete: 'CASCADE',
      },
      sku: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('ProductVariants', ['productId'], { name: 'idx_productId' });
    await queryInterface.addIndex('ProductVariants', ['sku'], { name: 'idx_sku' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductVariants');
  }
};