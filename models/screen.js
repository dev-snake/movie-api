'use strict';

module.exports = (sequelize, DataTypes) => {
    const Screen = sequelize.define(
        'Screen',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            theaterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100,
            },
        },
        {
            tableName: 'screens',
            timestamps: true,
        },
    );

    Screen.associate = function (models) {
        Screen.belongsTo(models.Theater, {
            foreignKey: 'theaterId',
            as: 'theater',
        });
        Screen.hasMany(models.Seat, {
            foreignKey: 'screenId',
            as: 'seats',
        });
        Screen.hasMany(models.Showtime, {
            foreignKey: 'screenId',
            as: 'showtimes',
        });
    };

    return Screen;
};
