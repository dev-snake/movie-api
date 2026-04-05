'use strict';

module.exports = (sequelize, DataTypes) => {
    const ConcessionCategory = sequelize.define(
        'ConcessionCategory',
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
                defaultValue: '#E50914',
            },
            sortOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: 'concession_categories',
            timestamps: true,
            hooks: {
                beforeCreate: (cat) => {
                    if (!cat.slug) {
                        cat.slug = cat.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    }
                },
                beforeUpdate: (cat) => {
                    if (cat.changed('name') && !cat.changed('slug')) {
                        cat.slug = cat.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    }
                },
            },
        },
    );

    return ConcessionCategory;
};
