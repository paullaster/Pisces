'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      firstName: {
        type: Sequelize.STRING(100)
      },
      lastName: {
        type: Sequelize.STRING(100)
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255)
      },
      email_verified_at: {
        type: Sequelize.DATE
      },
      veryfied: {
        type: Sequelize.BOOLEAN
      },
      completed: {
        type: Sequelize.BOOLEAN
      },
      type: {
        type: Sequelize.ENUM('customer', 'admin'),
        defaultValue: 'customer',
        allowNull: false,
      },
      lastLogin: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    await queryInterface.addIndex('Users', ['email'], { name: 'idx_email' })
    await queryInterface.addIndex('Users', ['phoneNumber'], { name: 'idx_phoneNumber' })
    await queryInterface.addIndex('Users', ['lastLogin'], { name: 'idx_lastLogin' })
    await queryInterface.addIndex('Users', ['createdAt'], { name: 'idx_createdAt' })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};