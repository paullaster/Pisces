'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VariantAttributes', {
      variantAttributeId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      variantId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'ProductVariants',
          key: 'variantId'
        },
        onDelete: 'CASCADE',
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
    });
    await queryInterface.addIndex('VariantAttributes', ['variantId'], { name: 'idx_variantId' });
    await queryInterface.addIndex('VariantAttributes', ['valueId'], { name: 'idx_valueId' });
    await queryInterface.addConstraint('VariantAttributes', {
      fields: ['variantId', 'valueId'],
      type: 'primary key',
      name: 'variant_attributes_pk',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VariantAttributes');
  }
};