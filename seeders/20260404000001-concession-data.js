'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        await queryInterface.bulkInsert('concessions', [
            { name: 'Solo Combo', description: '1 Medium Popcorn + 1 Medium Drink', price: 85000, image: null, category: 'combo', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Couple Combo', description: '1 Large Popcorn + 2 Medium Drinks', price: 125000, image: null, category: 'combo', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Family Combo', description: '2 Large Popcorns + 4 Medium Drinks', price: 210000, image: null, category: 'combo', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Caramel Popcorn (L)', description: 'Large caramel-flavored popcorn', price: 65000, image: null, category: 'popcorn', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Cheese Popcorn (L)', description: 'Large cheese-flavored popcorn', price: 65000, image: null, category: 'popcorn', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Coca-Cola (M)', description: 'Medium Coca-Cola', price: 35000, image: null, category: 'drink', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Sprite (M)', description: 'Medium Sprite', price: 35000, image: null, category: 'drink', isActive: true, createdAt: now, updatedAt: now },
            { name: 'Nachos', description: 'Nachos with cheese dip', price: 55000, image: null, category: 'snack', isActive: true, createdAt: now, updatedAt: now },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('concessions', null, {});
    },
};
