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
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      purpose: {
        allowNull: false,
        type: Sequelize.ENUM('newAccount', 'passwordReset'),
        defaultValue: 'newAccount'
      },
      expiryTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isUsed: {
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
    await queryInterface.addIndex('one_time_passwords', ['otp', 'purpose', 'expiryTime', 'isUsed']);
    await queryInterface.addIndex('one_time_passwords', ['userId'], { name: 'idx_userId' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('one_time_passwords');
  }
};