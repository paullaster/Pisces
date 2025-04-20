'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('one_time_passwords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('newAccount', 'passwordReset'),
        defaultValue: 'newAccount'
      },
      expireAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      requestingDevice: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
    await queryInterface.addIndex('one_time_passwords', ['otp', 'type', 'expireAt', 'used'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('one_time_passwords');
  }
};