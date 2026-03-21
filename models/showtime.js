'use strict';

module.exports = (sequelize, DataTypes) => {
    const Showtime = sequelize.define(
        'Showtime',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            movieId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            screenId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM('active', 'cancelled'),
                defaultValue: 'active',
            },
        },
        {
            tableName: 'showtimes',
            timestamps: true,
        },
    );

    Showtime.associate = function (models) {
        Showtime.belongsTo(models.Movie, {
            foreignKey: 'movieId',
            as: 'movie',
        });
        Showtime.belongsTo(models.Screen, {
            foreignKey: 'screenId',
            as: 'screen',
        });
        Showtime.hasMany(models.Booking, {
            foreignKey: 'showtimeId',
            as: 'bookings',
        });
    };

    return Showtime;
};
