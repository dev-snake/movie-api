'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bookings', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            showtimeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'showtimes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            totalAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
                defaultValue: 'pending',
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

        // Index để tìm kiếm nhanh booking của user
        await queryInterface.addIndex('bookings', ['userId', 'createdAt']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('bookings');
    },
};
