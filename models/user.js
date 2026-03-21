'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
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
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('user', 'admin'),
                defaultValue: 'user',
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            tableName: 'users',
            timestamps: true,
        },
    );

    User.associate = function (models) {
        // User can have many favorites
        User.hasMany(models.Favorite, {
            foreignKey: 'userId',
            as: 'favorites',
        });
        // User can have many comments
        User.hasMany(models.Comment, {
            foreignKey: 'userId',
            as: 'comments',
        });

        // User can have many bookings
        User.hasMany(models.Booking, {
            foreignKey: 'userId',
            as: 'bookings',
        });
    };

    return User;
};
