'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
      itemId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255)
      },
      cartId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Carts',
          key: 'cartId',
        },
        onDelete: 'CASCADE',
      },
      variantId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'ProductVariants',
          key: 'variantId'
        },
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: Sequelize.INTEGER
      },
    });
    await queryInterface.addConstraint('CartItems', {
      fields: ['cartId', 'variantId'],
      type: 'primary key',
      name: 'cart_items_pk',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartItems');
  }
};