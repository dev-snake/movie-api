'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        'Comment',
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
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'comments',
            timestamps: true,
        },
    );

    Comment.associate = function (models) {
        Comment.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        Comment.belongsTo(models.Movie, {
            foreignKey: 'movieId',
            as: 'movie',
        });
    };

    return Comment;
};
