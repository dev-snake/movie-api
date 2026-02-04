'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('favorites', {
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
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        // Unique constraint để không thể yêu thích 1 phim 2 lần
        await queryInterface.addIndex('favorites', ['userId', 'movieId'], {
            unique: true,
            name: 'favorites_user_movie_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('favorites');
    },
};
