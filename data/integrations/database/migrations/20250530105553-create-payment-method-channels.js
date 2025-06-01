'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PaymentMethodChannels', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
    await queryInterface.addIndex('PaymentMethodChannels', ['code']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PaymentMethodChannels');
  }
};