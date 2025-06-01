'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attributes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
    });
    await queryInterface.addIndex('Attributes', ['name'], { name: 'idx_name' })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Attributes');
  }
};