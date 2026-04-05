'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('genres', 'color', {
            type: Sequelize.STRING(20),
            allowNull: true,
            defaultValue: '#E50914',
            after: 'description',
        });
        await queryInterface.addColumn('genres', 'sortOrder', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            after: 'color',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('genres', 'color');
        await queryInterface.removeColumn('genres', 'sortOrder');
    },
};
