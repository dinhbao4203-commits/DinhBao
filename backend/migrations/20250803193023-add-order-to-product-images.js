'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product_images', 'order', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('product_images', 'order');
  }
};
