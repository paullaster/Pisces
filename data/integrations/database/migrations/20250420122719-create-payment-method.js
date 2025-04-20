'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PaymentMethods', {
      methodId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      channel: {
        type: Sequelize.ENUM('B2C_STK_PUSH', 'C2B', 'B2C_RTG'),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('CARD', 'MOBILE_MONEY', 'OTHER'),
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addIndex('PaymentMethods', ['name', 'channel', 'type']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PaymentMethods');
  }
};