'use strict';

module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define(
        'Genre',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue: '#E50914',
            },
            sortOrder: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: 'genres',
            timestamps: true,
            hooks: {
                beforeCreate: (genre) => {
                    genre.slug = genre.name.toLowerCase().replace(/\s+/g, '-');
                },
                beforeUpdate: (genre) => {
                    if (genre.changed('name')) {
                        genre.slug = genre.name.toLowerCase().replace(/\s+/g, '-');
                    }
                },
            },
        },
    );

    Genre.associate = function (models) {
        // Genre belongs to many movies
        Genre.belongsToMany(models.Movie, {
            through: 'movie_genres',
            as: 'movies',
            foreignKey: 'genreId',
        });
    };

    return Genre;
};
