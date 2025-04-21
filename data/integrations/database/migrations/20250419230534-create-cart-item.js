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
      fields: ['cartId'],
      type: 'foreign key',
      name: 'fk_CartItems_cardId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        table: 'Carts',
        field: 'cartId',
      }
    });
    await queryInterface.addConstraint('CartItems', {
      fields: ['variantId'],
      type: 'foreign key',
      name: 'fk_CartItems_variantId',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      references: {
        table: 'ProductVariants',
        field: 'variantId'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartItems');
  }
};