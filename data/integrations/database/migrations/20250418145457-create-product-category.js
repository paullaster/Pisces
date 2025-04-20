'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      categoryId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Categoris',
          key: 'cid',
        },
        onDelete: 'RESTRICT',
      },
      productId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Products',
          key: 'pid',
        },
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.addConstraint('ProductCategories', {
      fields: ['categoryId', 'productId'],
      type: 'primary key',
      name: 'product_categories_pk'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductCategories');
  }
};