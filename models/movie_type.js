'use strict';

module.exports = (sequelize, DataTypes) => {
    const MovieType = sequelize.define(
        'MovieType',
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
            slug: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            color: {
                type: DataTypes.STRING(20),
                allowNull: true,
                defaultValue: '#17A2B8',
            },
            sortOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: 'movie_types',
            timestamps: true,
            hooks: {
                beforeValidate: (mt) => {
                    if (!mt.slug) {
                        const base = mt.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        mt.slug = base || `type-${Date.now()}`;
                    }
                },
                beforeUpdate: (mt) => {
                    if (mt.changed('name') && !mt.changed('slug')) {
                        const base = mt.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        mt.slug = base || `type-${Date.now()}`;
                    }
                },
            },
        },
    );

    return MovieType;
};
