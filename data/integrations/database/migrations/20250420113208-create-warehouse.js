'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Warehouses', {
      warehouseId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      warehouseName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      location: {
        type: Sequelize.JSON,
        allowNull: false,
      },
    });
    await queryInterface.addIndex('Warehouses', ['location']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Warehouses');
  }
};