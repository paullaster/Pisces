'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      imgId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      imagableId: {
        type: Sequelize.STRING(255),
      },
      imagableType: {
        allowNull: true,
        unique: false,
        type: Sequelize.STRING,
      },
      mimetype: {
        allowNull: false,
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images');
  }
};