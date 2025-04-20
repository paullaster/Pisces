'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VariantAttributes', {
      variantId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'ProductVariants',
          key: 'variantId'
        },
        onDelete: 'CASCADE',
      },
      attributeId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Attributes',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      valueId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'AttributeValues',
          key: 'id'
        },
        onDelete: 'RESTRICT',
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
    await queryInterface.addIndex('VariantAttributes', ['variantId'], { name: 'idx_variantId' });
    await queryInterface.addIndex('VariantAttributes', ['attributeId'], { name: 'idx_attributeId' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VariantAttributes');
  }
};