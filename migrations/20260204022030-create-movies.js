'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('movies', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            posterUrl: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            trailerUrl: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            releaseYear: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            rating: {
                type: Sequelize.DECIMAL(3, 1),
                defaultValue: 0,
            },
            views: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            type: {
                type: Sequelize.ENUM('single', 'series'),
                defaultValue: 'single',
            },
            status: {
                type: Sequelize.ENUM('draft', 'published'),
                defaultValue: 'draft',
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('movies');
    },
};
