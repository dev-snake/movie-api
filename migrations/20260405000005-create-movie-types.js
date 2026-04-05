'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('movie_types', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            slug: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            color: {
                type: Sequelize.STRING(20),
                allowNull: true,
                defaultValue: '#17A2B8',
            },
            sortOrder: {
                type: Sequelize.INTEGER,
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

        // Seed default types
        await queryInterface.bulkInsert('movie_types', [
            { name: 'Phim lẻ', slug: 'single', color: '#17A2B8', sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
            { name: 'Phim bộ', slug: 'series', color: '#FFC107', sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
        ]);

        // Change movies.type from ENUM to VARCHAR
        await queryInterface.sequelize.query(
            "ALTER TABLE movies MODIFY COLUMN type VARCHAR(50) NOT NULL DEFAULT 'single'"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('movie_types');
        await queryInterface.sequelize.query(
            "ALTER TABLE movies MODIFY COLUMN type ENUM('single','series') NOT NULL DEFAULT 'single'"
        );
    },
};
