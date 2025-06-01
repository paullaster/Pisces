'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      addressId: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      street: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      streetCode: {
        type: Sequelize.STRING(255)
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      zip: {
        type: Sequelize.STRING(255),
      },
      address: {
        type: Sequelize.TEXT,
      },
      default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 6),
        defaultValue: 0,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 0,
      },
      appartment: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      town: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      placeId: {
        type: Sequelize.STRING(255),
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
    await queryInterface.addIndex('Addresses', ['city', 'town', 'street'], { name: 'idx_city_town_street' });
    await queryInterface.addIndex('Addresses', ['userId'], { name: 'idx_userId' });
    await queryInterface.addConstraint('Addresses', {
      type: 'foreign key',
      fields: ['userId'],
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
  }
};