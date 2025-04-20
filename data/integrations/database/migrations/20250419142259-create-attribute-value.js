'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AttributeValues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      attributeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Attributes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING(255)
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
    await queryInterface.addIndex('AttributeValues', ['attributeId'], { name: 'idx_attributeId' });
    await queryInterface.addIndex('AttributeValues', ['value'], { name: 'idx_value' });
    await queryInterface.addConstraint('AttributeValues', {
      fields: ['attributeId', 'value'],
      type: 'unique',
      name: 'unique_attribute_value'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AttributeValues');
  }
};