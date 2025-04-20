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
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'email',
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};