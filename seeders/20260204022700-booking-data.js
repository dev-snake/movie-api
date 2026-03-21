'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Seed Theaters
        await queryInterface.bulkInsert('theaters', [
            {
                name: 'CGV Vincom Center',
                address: '72 Lê Thánh Tôn, Q.1, TP.HCM',
                phone: '1900 6017',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Lotte Cinema Cantavil',
                address: 'Tầng 7, Cantavil Premier, An Phú, Q.2, TP.HCM',
                phone: '1900 0088',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Galaxy Nguyễn Du',
                address: '116 Nguyễn Du, Q.1, TP.HCM',
                phone: '1900 2224',
                createdAt: now,
                updatedAt: now,
            },
        ]);

        // Seed Screens (mỗi rạp có 2 phòng chiếu)
        await queryInterface.bulkInsert('screens', [
            // CGV Vincom - 2 phòng
            { theaterId: 1, name: 'Phòng 1', capacity: 80, createdAt: now, updatedAt: now },
            { theaterId: 1, name: 'Phòng 2', capacity: 60, createdAt: now, updatedAt: now },
            // Lotte - 2 phòng
            { theaterId: 2, name: 'Phòng A', capacity: 100, createdAt: now, updatedAt: now },
            { theaterId: 2, name: 'Phòng B', capacity: 80, createdAt: now, updatedAt: now },
            // Galaxy - 2 phòng
            { theaterId: 3, name: 'Screen 1', capacity: 70, createdAt: now, updatedAt: now },
            { theaterId: 3, name: 'Screen 2', capacity: 50, createdAt: now, updatedAt: now },
        ]);

        // Seed Seats cho mỗi screen
        // Screen 1 (CGV Phòng 1): 8 hàng x 10 ghế = 80 ghế
        const screen1Seats = [];
        for (let r = 0; r < 8; r++) {
            const row = String.fromCharCode(65 + r); // A-H
            for (let n = 1; n <= 10; n++) {
                screen1Seats.push({
                    screenId: 1,
                    row,
                    number: n,
                    type: ['D', 'E', 'F'].includes(row) ? 'vip' : 'normal',
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Screen 2 (CGV Phòng 2): 6 hàng x 10 ghế = 60 ghế
        const screen2Seats = [];
        for (let r = 0; r < 6; r++) {
            const row = String.fromCharCode(65 + r); // A-F
            for (let n = 1; n <= 10; n++) {
                screen2Seats.push({
                    screenId: 2,
                    row,
                    number: n,
                    type: ['C', 'D'].includes(row) ? 'vip' : 'normal',
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Screen 3 (Lotte Phòng A): 10 hàng x 10 ghế = 100 ghế
        const screen3Seats = [];
        for (let r = 0; r < 10; r++) {
            const row = String.fromCharCode(65 + r); // A-J
            for (let n = 1; n <= 10; n++) {
                screen3Seats.push({
                    screenId: 3,
                    row,
                    number: n,
                    type: ['E', 'F', 'G'].includes(row) ? 'vip' : 'normal',
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Screen 4 (Lotte Phòng B): 8 hàng x 10 ghế = 80 ghế
        const screen4Seats = [];
        for (let r = 0; r < 8; r++) {
            const row = String.fromCharCode(65 + r);
            for (let n = 1; n <= 10; n++) {
                screen4Seats.push({
                    screenId: 4,
                    row,
                    number: n,
                    type: ['D', 'E'].includes(row) ? 'vip' : 'normal',
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Screen 5 (Galaxy Screen 1): 7 hàng x 10 ghế = 70 ghế
        const screen5Seats = [];
        for (let r = 0; r < 7; r++) {
            const row = String.fromCharCode(65 + r);
            for (let n = 1; n <= 10; n++) {
                screen5Seats.push({
                    screenId: 5,
                    row,
                    number: n,
                    type: ['D', 'E'].includes(row) ? 'vip' : 'normal',
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        // Screen 6 (Galaxy Screen 2): 5 hàng x 10 ghế = 50 ghế
        const screen6Seats = [];
        for (let r = 0; r < 5; r++) {
            const row = String.fromCharCode(65 + r);
            for (let n = 1; n <= 10; n++) {
                screen6Seats.push({
                    screenId: 6,
                    row,
                    number: n,
                    type: row === 'C' ? 'vip' : 'normal',
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        await queryInterface.bulkInsert('seats', [
            ...screen1Seats,
            ...screen2Seats,
            ...screen3Seats,
            ...screen4Seats,
            ...screen5Seats,
            ...screen6Seats,
        ]);

        // Seed Showtimes (một số suất chiếu mẫu cho ngày mai)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const createShowtime = (movieId, screenId, hour, minute, duration, price) => {
            const start = new Date(tomorrow);
            start.setHours(hour, minute, 0, 0);
            const end = new Date(start.getTime() + (duration + 15) * 60 * 1000);
            return {
                movieId,
                screenId,
                startTime: start,
                endTime: end,
                price,
                status: 'active',
                createdAt: now,
                updatedAt: now,
            };
        };

        await queryInterface.bulkInsert('showtimes', [
            // Avengers (181 phút) - CGV Phòng 1
            createShowtime(1, 1, 10, 0, 181, 90000),
            createShowtime(1, 1, 14, 0, 181, 90000),
            createShowtime(1, 1, 19, 0, 181, 110000),

            // Parasite (132 phút) - CGV Phòng 2
            createShowtime(3, 2, 11, 0, 132, 85000),
            createShowtime(3, 2, 16, 0, 132, 85000),
            createShowtime(3, 2, 20, 0, 132, 100000),

            // Avengers - Lotte Phòng A
            createShowtime(1, 3, 13, 0, 181, 95000),
            createShowtime(1, 3, 18, 30, 181, 115000),

            // Parasite - Galaxy Screen 1
            createShowtime(3, 5, 15, 0, 132, 80000),
            createShowtime(3, 5, 19, 30, 132, 95000),
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('showtimes', null, {});
        await queryInterface.bulkDelete('seats', null, {});
        await queryInterface.bulkDelete('screens', null, {});
        await queryInterface.bulkDelete('theaters', null, {});
    },
};
