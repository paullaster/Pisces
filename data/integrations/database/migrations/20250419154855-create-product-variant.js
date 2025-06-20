'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductVariants', {
      variantId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      productId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Products',
          key: 'pid'
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    });
    await queryInterface.addIndex('ProductVariants', ['productId'], { name: 'idx_productId' });
    await queryInterface.addIndex('ProductVariants', ['sku'], { name: 'idx_sku' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductVariants');
  }
};