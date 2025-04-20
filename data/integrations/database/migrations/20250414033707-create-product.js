'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      pid: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      discountedPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      recipeTips: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
    await queryInterface.addIndex('Products', ['name'], { name: 'idx_name', type: 'FULLTEXT' })
    await queryInterface.addIndex('Products', ['price'], { name: 'idx_price' })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};