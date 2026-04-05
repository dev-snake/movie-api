'use strict';

module.exports = (sequelize, DataTypes) => {
    const Concession = sequelize.define(
        'Concession',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            image: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            category: {
                type: DataTypes.ENUM('combo', 'popcorn', 'drink', 'snack'),
                defaultValue: 'combo',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: 'concessions',
            timestamps: true,
        },
    );

    return Concession;
};
