'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItemDiscounts', {
      orderItemDiscountId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      orderItemId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'OrderItems',
          key: 'itemId',
        },
        onDelete: 'CASCADE',
      },
      discountId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Discounts',
          key: 'id'
        },
        onDelete: 'RESTRICT',
      },
      discountAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('OrderItemDiscounts', {
      fields: ['orderItemId'],
      type: 'foreign key',
      name: 'fk_OrderItemDiscounts_orderItemId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        table: 'OrderItems',
        field: 'itemId',
      }
    });
    await queryInterface.addConstraint('OrderItemDiscounts', {
      fields: ['discountId'],
      type: 'foreign key',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      references: {
        table: 'Discounts',
        field: 'id',
      },
      name: 'fk_OrderItemDiscounts_discountId'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItemDiscounts');
  }
};