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
          model: 'orderItems',
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
    await queryInterface.addConstraint('orderItemDiscounts', {
      fields: ['orderItemId', 'discountId'],
      type: 'primary key',
      name: 'order_item_discounts_pk'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItemDiscounts');
  }
};