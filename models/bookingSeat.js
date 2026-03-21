'use strict';

module.exports = (sequelize, DataTypes) => {
    const BookingSeat = sequelize.define(
        'BookingSeat',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            bookingId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seatId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: 'booking_seats',
            timestamps: true,
        },
    );

    BookingSeat.associate = function (models) {
        BookingSeat.belongsTo(models.Booking, {
            foreignKey: 'bookingId',
            as: 'booking',
        });
        BookingSeat.belongsTo(models.Seat, {
            foreignKey: 'seatId',
            as: 'seat',
        });
    };

    return BookingSeat;
};
