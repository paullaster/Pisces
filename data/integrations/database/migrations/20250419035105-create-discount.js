'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Discounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('Percentage', 'Fixed'),
      },
      usageLimit: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      startPublishing: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endPublishing: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Published', 'UnPublished'),
        defaultValue: 'Published',
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
    await queryInterface.addIndex('Discounts', ['title'], { type: 'FULLTEXT', name: 'idx_title' });
    await queryInterface.addIndex('Discounts', ['amount'], { name: 'idx_amount' });
    await queryInterface.addIndex('Discounts', ['type'], { name: 'idx_name' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Discounts');
  }
};