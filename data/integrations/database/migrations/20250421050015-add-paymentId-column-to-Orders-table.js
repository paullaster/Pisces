'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'paymentId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      references: {
        model: 'payments',
        key: 'transId',
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('Orders', ['paymentId'], { name: 'idx_paymentId' });
    await queryInterface.addConstraint('Orders', {
      name: 'fk_Orders_paymentId',
      type: 'foreign key',
      fields: ['paymentId'],
      references: {
        table: 'payments',
        field: 'transId'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'paymentId');
  }
};
