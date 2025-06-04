'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Warehouses', {
      warehouseId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Warehouses');
  }
};