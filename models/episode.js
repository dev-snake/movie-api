'use strict';

module.exports = (sequelize, DataTypes) => {
    const Episode = sequelize.define(
        'Episode',
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
            episodeNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            videoUrl: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: 'episodes',
            timestamps: true,
        },
    );

    Episode.associate = function (models) {
        Episode.belongsTo(models.Movie, {
            foreignKey: 'movieId',
            as: 'movie',
        });
    };

    return Episode;
};
