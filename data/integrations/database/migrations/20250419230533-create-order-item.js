'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      itemId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      orderId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'orderId'
        },
        onDelete: 'CASCADE',
      },
      variantId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'ProductVariants',
          key: 'variantId'
        },
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
    await queryInterface.addIndex('OrderItems', ['orderId'], { name: 'idx_orderId' });
    await queryInterface.addIndex('OrderItems', ['variantId'], { name: 'idx_variantId' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
  }
};