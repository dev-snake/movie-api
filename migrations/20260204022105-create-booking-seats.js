'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('booking_seats', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'bookings',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            seatId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'seats',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        // Unique: mỗi ghế chỉ được đặt 1 lần trong 1 booking
        await queryInterface.addIndex('booking_seats', ['bookingId', 'seatId'], {
            unique: true,
            name: 'booking_seats_booking_seat_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('booking_seats');
    },
};
