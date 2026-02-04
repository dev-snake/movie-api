'use strict';

module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define(
        'Movie',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            releaseYear: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            posterUrl: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            trailerUrl: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            rating: {
                type: DataTypes.DECIMAL(3, 1),
                defaultValue: 0,
            },
            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            type: {
                type: DataTypes.ENUM('single', 'series'),
                defaultValue: 'single',
            },
            status: {
                type: DataTypes.ENUM('draft', 'published'),
                defaultValue: 'draft',
            },
        },
        {
            tableName: 'movies',
            timestamps: true,
            hooks: {
                beforeCreate: (movie) => {
                    movie.slug = movie.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                },
                beforeUpdate: (movie) => {
                    if (movie.changed('title')) {
                        movie.slug = movie.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '');
                    }
                },
            },
        },
    );

    Movie.associate = function (models) {
        // Movie belongs to many genres
        Movie.belongsToMany(models.Genre, {
            through: 'movie_genres',
            as: 'genres',
            foreignKey: 'movieId',
        });

        // Movie has many episodes
        Movie.hasMany(models.Episode, {
            foreignKey: 'movieId',
            as: 'episodes',
        });

        // Movie has many favorites
        Movie.hasMany(models.Favorite, {
            foreignKey: 'movieId',
            as: 'favorites',
        });

        // Movie has many comments
        Movie.hasMany(models.Comment, {
            foreignKey: 'movieId',
            as: 'comments',
        });
    };

    return Movie;
};
