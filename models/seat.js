'use strict';

module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define(
        'Seat',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            screenId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            row: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('normal', 'vip'),
                defaultValue: 'normal',
            },
        },
        {
            tableName: 'seats',
            timestamps: true,
        },
    );

    Seat.associate = function (models) {
        Seat.belongsTo(models.Screen, {
            foreignKey: 'screenId',
            as: 'screen',
        });
        Seat.hasMany(models.BookingSeat, {
            foreignKey: 'seatId',
            as: 'bookingSeats',
        });
    };

    return Seat;
};
