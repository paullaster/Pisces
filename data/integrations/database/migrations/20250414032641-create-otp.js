'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('one_time_passwords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      otp: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      expireAt: {
        type: Sequelize.DATE
      },
      used: {
        type: Sequelize.BOOLEAN
      },
      usedAt: {
        type: Sequelize.DATE
      },
      requestingDevice: {
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('one_time_passwords');
  }
};