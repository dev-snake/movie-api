'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'paymentMethod', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'status',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('bookings', 'paymentMethod');
  },
};
