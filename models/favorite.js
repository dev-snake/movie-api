'use strict';

module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define(
        'Favorite',
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
            movieId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'favorites',
            timestamps: true,
        },
    );

    Favorite.associate = function (models) {
        Favorite.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Favorite.belongsTo(models.Movie, {
            foreignKey: 'movieId',
            as: 'movie',
        });
    };

    return Favorite;
};
