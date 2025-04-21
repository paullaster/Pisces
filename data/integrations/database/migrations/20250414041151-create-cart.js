'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      cartId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255)
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',

        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('Carts', {
      type: 'foreign key',
      fields: ['userId'],
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      name: 'fk_Carts_userId',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};