'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductCategories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      categoryId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Categories',
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
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'fk_ProductCategories_categoryId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      references: {
        table: 'Categories',
        field: 'cid',
      }
    });
    await queryInterface.addConstraint('ProductCategories', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'fk_ProductCategories_productId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        table: 'Products',
        field: 'pid',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductCategories');
  }
};