'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      orderId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255)
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('New', 'Pending Processing', 'Processed', 'Pending Delivery', 'Delivered', 'Cancelled', 'In Transit'),
        defaultValue: 'New',
      },
      deliveryFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    await queryInterface.addIndex('Orders', ['userId'], { name: 'idx_userId' });
    await queryInterface.addIndex('Orders', ['totalAmount'], { name: 'idx_totalAmount' });
    await queryInterface.addIndex('Orders', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('Orders', ['createdAt'], { name: 'idx_createdAt' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};