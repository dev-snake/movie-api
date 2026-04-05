'use strict';

module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define(
        'Booking',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            showtimeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalAmount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
                defaultValue: 'pending',
            },
            paymentMethod: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            tableName: 'bookings',
            timestamps: true,
        },
    );

    Booking.associate = function (models) {
        Booking.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Booking.belongsTo(models.Showtime, {
            foreignKey: 'showtimeId',
            as: 'showtime',
        });
        Booking.hasMany(models.BookingSeat, {
            foreignKey: 'bookingId',
            as: 'bookingSeats',
        });
    };

    return Booking;
};
