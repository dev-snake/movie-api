'use strict';

module.exports = (sequelize, DataTypes) => {
    const Theater = sequelize.define(
        'Theater',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            tableName: 'theaters',
            timestamps: true,
        },
    );

    Theater.associate = function (models) {
        Theater.hasMany(models.Screen, {
            foreignKey: 'theaterId',
            as: 'screens',
        });
    };

    return Theater;
};
