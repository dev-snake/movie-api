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
                beforeValidate: (cat) => {
                    if (!cat.slug) {
                        const base = cat.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        cat.slug = base || `cat-${Date.now()}`;
                    }
                },
                beforeUpdate: (cat) => {
                    if (cat.changed('name') && !cat.changed('slug')) {
                        const base = cat.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        cat.slug = base || `cat-${Date.now()}`;
                    }
                },
            },
        },
    );

    return ConcessionCategory;
};
