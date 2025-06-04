'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductDiscounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
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
      discountId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Discounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.addConstraint('ProductDiscounts', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'fk_ProductDiscounts_productId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        table: 'Products',
        field: 'pid',
      }
    });
    await queryInterface.addConstraint('ProductDiscounts', {
      fields: ['discountId'],
      type: 'foreign key',
      name: 'fk_ProductDiscounts_discountId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        table: 'Discounts',
        field: 'id',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductDiscounts');
  }
};