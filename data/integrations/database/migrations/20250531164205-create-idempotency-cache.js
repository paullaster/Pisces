'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IdempotencyCaches', {
      key: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Completed', 'Failed'),
        allowNull: false,
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
    await queryInterface.addIndex('IdempotencyCaches', ['key'], {
      name: 'idx_key',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IdempotencyCaches');
  }
};