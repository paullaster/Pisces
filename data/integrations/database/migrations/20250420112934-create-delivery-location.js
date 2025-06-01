'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DeliveryLocations', {
      locationId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      warehouseId: {
        type: Sequelize.STRING,
        references: {
          model: 'Warehouses',
          key: 'warehouseId',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      destination: {
        type: Sequelize.JSON
      },
      distanceMeters: {
        type: Sequelize.INTEGER
      },
      durationSeconds: {
        type: Sequelize.BIGINT
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
    await queryInterface.addIndex('DeliveryLocations', ['warehouseId'], { name: 'idx_warehouseId' });
    await queryInterface.addIndex('DeliveryLocations', ['distanceMeters'], { name: 'idx_distanceMeters' });
    await queryInterface.addIndex('DeliveryLocations', ['durationSeconds'], { name: 'idx_durationSeconds' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DeliveryLocations');
  }
};