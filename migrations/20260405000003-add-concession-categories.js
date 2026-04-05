'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Create concession_categories table
        await queryInterface.createTable('concession_categories', {
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
                defaultValue: '#E50914',
            },
            sortOrder: {
                type: Sequelize.INTEGER,
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

        // 2. Seed 4 default categories
        const now = new Date();
        await queryInterface.bulkInsert('concession_categories', [
            { name: 'Combo',    slug: 'combo',    color: '#E50914', sortOrder: 1, createdAt: now, updatedAt: now },
            { name: 'Bắp rang', slug: 'popcorn',  color: '#FFC107', sortOrder: 2, createdAt: now, updatedAt: now },
            { name: 'Đồ uống',  slug: 'drink',    color: '#17A2B8', sortOrder: 3, createdAt: now, updatedAt: now },
            { name: 'Snack',    slug: 'snack',    color: '#28A745', sortOrder: 4, createdAt: now, updatedAt: now },
        ]);

        // 3. Change concessions.category from ENUM to VARCHAR (preserves existing data)
        await queryInterface.sequelize.query(
            "ALTER TABLE concessions MODIFY COLUMN category VARCHAR(50) NOT NULL DEFAULT 'combo'"
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('concession_categories');
        // Revert category back to ENUM
        await queryInterface.sequelize.query(
            "ALTER TABLE concessions MODIFY COLUMN category ENUM('combo','popcorn','drink','snack') NOT NULL DEFAULT 'combo'"
        );
    },
};
