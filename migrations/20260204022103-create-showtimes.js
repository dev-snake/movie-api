'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('showtimes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            movieId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'movies',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            screenId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'screens',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            startTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('active', 'cancelled'),
                defaultValue: 'active',
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

        // Index để tìm kiếm nhanh theo movie và thời gian
        await queryInterface.addIndex('showtimes', ['movieId', 'startTime']);
        await queryInterface.addIndex('showtimes', ['screenId', 'startTime']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('showtimes');
    },
};
