'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductDiscounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
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
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Discounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.addConstraint('ProductDiscounts', {
      fields: ['productId', 'discountId'],
      type: 'primary key',
      name: 'product_discount_pk'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductDiscounts');
  }
};