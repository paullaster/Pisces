'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      transId: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      orderId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'orderId',
        },
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      transactionID: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      paymentMethodId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'PaymentMethods',
          key: 'methodId',
        },
        onDelete: 'RESTRICT',
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
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
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });
    await queryInterface.addIndex('payments', ['amount'], { name: 'idx_amount' });
    await queryInterface.addIndex('payments', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('payments', ['paymentMethodId'], { name: 'idx_paymentMethodId' });
    await queryInterface.addIndex('payments', ['orderId',], { name: 'idx_orderId' });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};