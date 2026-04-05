'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const hashedPassword = await bcrypt.hash('password123', 10);
        const hashedAdmin = await bcrypt.hash('admin@123', 10);

        // ─── Additional Admin accounts ───────────────────────────
        await queryInterface.bulkInsert('users', [
            {
                name: 'Trần Quản Lý',
                email: 'manager@cineadmin.vn',
                password: hashedAdmin,
                role: 'admin',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Lê Vận Hành',
                email: 'operator@cineadmin.vn',
                password: hashedAdmin,
                role: 'admin',
                createdAt: now,
                updatedAt: now,
            },
            // ─── Regular users ───────────────────────────────────
            {
                name: 'Nguyễn Văn An',
                email: 'nguyenvanan@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-01-15'),
                updatedAt: new Date('2026-01-15'),
            },
            {
                name: 'Trần Thị Bình',
                email: 'tranthibinh@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-01-20'),
                updatedAt: new Date('2026-01-20'),
            },
            {
                name: 'Phạm Hoàng Cường',
                email: 'phamcuong@yahoo.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-02-01'),
                updatedAt: new Date('2026-02-01'),
            },
            {
                name: 'Lê Minh Đức',
                email: 'leminhduc@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-02-10'),
                updatedAt: new Date('2026-02-10'),
            },
            {
                name: 'Võ Thị Hoa',
                email: 'vothihoa@hotmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-02-14'),
                updatedAt: new Date('2026-02-14'),
            },
            {
                name: 'Đặng Quốc Khánh',
                email: 'dangkhanh@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-02-20'),
                updatedAt: new Date('2026-02-20'),
            },
            {
                name: 'Huỳnh Thị Lan',
                email: 'huynhlan@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-03-01'),
                updatedAt: new Date('2026-03-01'),
            },
            {
                name: 'Bùi Thanh Minh',
                email: 'buiminh@outlook.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-03-05'),
                updatedAt: new Date('2026-03-05'),
            },
            {
                name: 'Hoàng Phương Nam',
                email: 'hoangnam@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-03-10'),
                updatedAt: new Date('2026-03-10'),
            },
            {
                name: 'Ngô Thị Phương',
                email: 'ngophuong@gmail.com',
                password: hashedPassword,
                role: 'user',
                createdAt: new Date('2026-03-15'),
                updatedAt: new Date('2026-03-15'),
            },
        ]);

        // ─── Bookings (sample data for admin dashboard) ──────────
        // Resolve seat IDs dynamically by screenId + row + number
        const [allSeats] = await queryInterface.sequelize.query(
            'SELECT id, screenId, `row`, `number` FROM seats WHERE screenId IN (1,2,3,5)',
        );
        const seatMap = {};
        for (const s of allSeats) {
            seatMap[`${s.screenId}:${s.row}:${s.number}`] = s.id;
        }

        // Resolve user IDs dynamically
        const [userRows] = await queryInterface.sequelize.query(
            "SELECT id, email FROM users ORDER BY id",
        );
        // Map position index (0-based from our inserted users) to actual DB ids
        // userRows[0] = admin@example.com (id 1)
        // userRows[1] = user@example.com  (id 2)
        // userRows[2]+ = our new users
        const uId = (idx) => userRows[idx]?.id; // 0-based index into all users

        const bookings = [];
        const bookingSeats = [];
        let bookingId = 1;

        // [userIdx(0-based), showtimeId, totalAmount, status, [[screenId, row, number, price], ...]]
        const bookingConfigs = [
            [2,  1, 190000, 'confirmed', [[1,'A',1,95000],[1,'A',2,95000]]],
            [3,  1, 285000, 'confirmed', [[1,'B',3,95000],[1,'B',4,95000],[1,'B',5,95000]]],
            [4,  2, 210000, 'confirmed', [[1,'C',1,105000],[1,'C',2,105000]]],
            [5,  2, 105000, 'pending',   [[1,'D',5,105000]]],
            [6,  3, 190000, 'confirmed', [[1,'A',3,95000],[1,'A',4,95000]]],
            [7,  3, 95000,  'cancelled', [[1,'E',1,95000]]],
            [8,  4, 380000, 'confirmed', [[2,'A',1,95000],[2,'A',2,95000],[2,'A',3,95000],[2,'A',4,95000]]],
            [9,  5, 230000, 'confirmed', [[2,'B',1,115000],[2,'B',2,115000]]],
            [10, 5, 115000, 'pending',   [[2,'C',3,115000]]],
            [11, 6, 200000, 'confirmed', [[2,'A',5,100000],[2,'A',6,100000]]],
            [2,  7, 190000, 'confirmed', [[3,'C',5,95000],[3,'C',6,95000]]],
            [3,  8, 95000,  'confirmed', [[3,'A',5,95000]]],
            [4,  9, 380000, 'confirmed', [[5,'B',7,95000],[5,'B',8,95000],[5,'B',9,95000],[5,'B',10,95000]]],
            [6,  10,230000, 'confirmed', [[5,'D',7,115000],[5,'D',8,115000]]],
            [8,  1, 285000, 'confirmed', [[1,'C',3,95000],[1,'C',4,95000],[1,'C',5,95000]]],
        ];

        for (const [userIdx, showtimeId, totalAmount, status, seats] of bookingConfigs) {
            const userId = uId(userIdx);
            if (!userId) continue;
            const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
            bookings.push({ userId, showtimeId, totalAmount, status, createdAt, updatedAt: createdAt });

            for (const [screenId, row, number, price] of seats) {
                const seatId = seatMap[`${screenId}:${row}:${number}`];
                if (seatId) {
                    bookingSeats.push({
                        bookingId,
                        seatId,
                        price,
                        createdAt,
                        updatedAt: createdAt,
                    });
                }
            }
            bookingId++;
        }

        await queryInterface.bulkInsert('bookings', bookings);
        await queryInterface.bulkInsert('booking_seats', bookingSeats);

        // ─── Comments (sample reviews) ───────────────────────────
        await queryInterface.bulkInsert('comments', [
            { userId: uId(2), movieId: 1, content: 'Phim quá đỉnh! Endgame xứng đáng là bộ phim hay nhất MCU.', createdAt: new Date('2026-03-20'), updatedAt: new Date('2026-03-20') },
            { userId: uId(3), movieId: 1, content: 'Cảnh chiến đấu cuối cùng khiến mình nổi da gà.', createdAt: new Date('2026-03-21'), updatedAt: new Date('2026-03-21') },
            { userId: uId(4), movieId: 3, content: 'Parasite thực sự là kiệt tác. Kịch bản không thể đoán trước!', createdAt: new Date('2026-03-22'), updatedAt: new Date('2026-03-22') },
            { userId: uId(5), movieId: 2, content: 'Squid Game gây nghiện quá! Xem hết 9 tập trong 1 đêm.', createdAt: new Date('2026-03-23'), updatedAt: new Date('2026-03-23') },
            { userId: uId(6), movieId: 4, content: 'Money Heist rất hồi hộp, đặc biệt là mùa 1 và 2.', createdAt: new Date('2026-03-24'), updatedAt: new Date('2026-03-24') },
            { userId: uId(7), movieId: 1, content: 'Đã xem 3 lần rồi vẫn thấy hay!', createdAt: new Date('2026-03-25'), updatedAt: new Date('2026-03-25') },
            { userId: uId(8), movieId: 3, content: 'Bong Joon-ho xứng đáng nhận Oscar. Phim rất sâu sắc.', createdAt: new Date('2026-03-26'), updatedAt: new Date('2026-03-26') },
            { userId: uId(9), movieId: 2, content: 'Mùa 2 Squid Game có hay bằng mùa 1 không mọi người?', createdAt: new Date('2026-03-27'), updatedAt: new Date('2026-03-27') },
        ]);

        // ─── Favorites ──────────────────────────────────────────
        await queryInterface.bulkInsert('favorites', [
            { userId: uId(2),  movieId: 1, createdAt: now, updatedAt: now },
            { userId: uId(2),  movieId: 3, createdAt: now, updatedAt: now },
            { userId: uId(3),  movieId: 1, createdAt: now, updatedAt: now },
            { userId: uId(3),  movieId: 2, createdAt: now, updatedAt: now },
            { userId: uId(4),  movieId: 3, createdAt: now, updatedAt: now },
            { userId: uId(4),  movieId: 4, createdAt: now, updatedAt: now },
            { userId: uId(5),  movieId: 2, createdAt: now, updatedAt: now },
            { userId: uId(6),  movieId: 4, createdAt: now, updatedAt: now },
            { userId: uId(6),  movieId: 1, createdAt: now, updatedAt: now },
            { userId: uId(7),  movieId: 1, createdAt: now, updatedAt: now },
            { userId: uId(8),  movieId: 3, createdAt: now, updatedAt: now },
            { userId: uId(9),  movieId: 2, createdAt: now, updatedAt: now },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('favorites', null, {});
        await queryInterface.bulkDelete('comments', null, {});
        await queryInterface.bulkDelete('booking_seats', null, {});
        await queryInterface.bulkDelete('bookings', null, {});
        // Only delete the users we added (id > 2)
        await queryInterface.bulkDelete('users', { id: { [require('sequelize').Op.gt]: 2 } }, {});
    },
};
