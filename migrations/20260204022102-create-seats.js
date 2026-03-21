'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('seats', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            row: {
                type: Sequelize.STRING(5),
                allowNull: false,
            },
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('normal', 'vip'),
                defaultValue: 'normal',
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

        // Unique constraint: mỗi ghế trong phòng là duy nhất
        await queryInterface.addIndex('seats', ['screenId', 'row', 'number'], {
            unique: true,
            name: 'seats_screen_row_number_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('seats');
    },
};
