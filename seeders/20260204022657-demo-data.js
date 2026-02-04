'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Seed Users
        const hashedPassword = await bcrypt.hash('password123', 10);
        await queryInterface.bulkInsert('users', [
            {
                name: 'Admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'User Demo',
                email: 'user@example.com',
                password: hashedPassword,
                role: 'user',
                createdAt: now,
                updatedAt: now,
            },
        ]);

        // Seed Genres
        await queryInterface.bulkInsert('genres', [
            {
                name: 'Hành động',
                slug: 'hanh-dong',
                description: 'Phim hành động',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Hài hước',
                slug: 'hai-huoc',
                description: 'Phim hài hước',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Tình cảm',
                slug: 'tinh-cam',
                description: 'Phim tình cảm',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Kinh dị',
                slug: 'kinh-di',
                description: 'Phim kinh dị',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Khoa học viễn tưởng',
                slug: 'khoa-hoc-vien-tuong',
                description: 'Phim khoa học viễn tưởng',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Hoạt hình',
                slug: 'hoat-hinh',
                description: 'Phim hoạt hình',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Phiêu lưu',
                slug: 'phieu-luu',
                description: 'Phim phiêu lưu',
                createdAt: now,
                updatedAt: now,
            },
            {
                name: 'Tâm lý',
                slug: 'tam-ly',
                description: 'Phim tâm lý',
                createdAt: now,
                updatedAt: now,
            },
        ]);

        // Seed Movies
        await queryInterface.bulkInsert('movies', [
            {
                title: 'Avengers: Endgame',
                slug: 'avengers-endgame',
                description:
                    'Sau các sự kiện tàn khốc của Avengers: Infinity War, vũ trụ đang trong tình trạng hỗn loạn.',
                posterUrl: 'https://via.placeholder.com/300x450',
                trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
                releaseYear: 2019,
                duration: 181,
                rating: 8.4,
                views: 1000,
                type: 'single',
                status: 'published',
                createdAt: now,
                updatedAt: now,
            },
            {
                title: 'Squid Game',
                slug: 'squid-game',
                description:
                    'Hàng trăm người chơi thiếu tiền chấp nhận một lời mời kỳ lạ để tham gia các trò chơi sinh tồn.',
                posterUrl: 'https://via.placeholder.com/300x450',
                trailerUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
                releaseYear: 2021,
                duration: 60,
                rating: 8.0,
                views: 2000,
                type: 'series',
                status: 'published',
                createdAt: now,
                updatedAt: now,
            },
            {
                title: 'Parasite',
                slug: 'parasite',
                description: 'Gia đình Ki-taek toàn kẻ thất nghiệp, tương lai mờ mịt trước mắt.',
                posterUrl: 'https://via.placeholder.com/300x450',
                trailerUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
                releaseYear: 2019,
                duration: 132,
                rating: 8.5,
                views: 800,
                type: 'single',
                status: 'published',
                createdAt: now,
                updatedAt: now,
            },
            {
                title: 'Money Heist',
                slug: 'money-heist',
                description:
                    'Một thiên tài tội phạm bí ẩn lên kế hoạch cướp lớn nhất trong lịch sử.',
                posterUrl: 'https://via.placeholder.com/300x450',
                trailerUrl: 'https://www.youtube.com/watch?v=htEsweT08rc',
                releaseYear: 2017,
                duration: 50,
                rating: 8.2,
                views: 1500,
                type: 'series',
                status: 'published',
                createdAt: now,
                updatedAt: now,
            },
        ]);

        // Seed Movie-Genre relationships
        await queryInterface.bulkInsert('movie_genres', [
            { movieId: 1, genreId: 1, createdAt: now, updatedAt: now }, // Avengers - Hành động
            { movieId: 1, genreId: 5, createdAt: now, updatedAt: now }, // Avengers - Khoa học viễn tưởng
            { movieId: 2, genreId: 8, createdAt: now, updatedAt: now }, // Squid Game - Tâm lý
            { movieId: 2, genreId: 4, createdAt: now, updatedAt: now }, // Squid Game - Kinh dị
            { movieId: 3, genreId: 8, createdAt: now, updatedAt: now }, // Parasite - Tâm lý
            { movieId: 3, genreId: 2, createdAt: now, updatedAt: now }, // Parasite - Hài hước
            { movieId: 4, genreId: 1, createdAt: now, updatedAt: now }, // Money Heist - Hành động
            { movieId: 4, genreId: 8, createdAt: now, updatedAt: now }, // Money Heist - Tâm lý
        ]);

        // Seed Episodes for series
        await queryInterface.bulkInsert('episodes', [
            {
                movieId: 2,
                episodeNumber: 1,
                title: 'Red Light, Green Light',
                videoUrl: 'https://example.com/video1',
                duration: 60,
                createdAt: now,
                updatedAt: now,
            },
            {
                movieId: 2,
                episodeNumber: 2,
                title: 'Hell',
                videoUrl: 'https://example.com/video2',
                duration: 62,
                createdAt: now,
                updatedAt: now,
            },
            {
                movieId: 2,
                episodeNumber: 3,
                title: 'The Man with the Umbrella',
                videoUrl: 'https://example.com/video3',
                duration: 55,
                createdAt: now,
                updatedAt: now,
            },
            {
                movieId: 4,
                episodeNumber: 1,
                title: 'Bắt đầu',
                videoUrl: 'https://example.com/video4',
                duration: 50,
                createdAt: now,
                updatedAt: now,
            },
            {
                movieId: 4,
                episodeNumber: 2,
                title: 'Kế hoạch',
                videoUrl: 'https://example.com/video5',
                duration: 48,
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('episodes', null, {});
        await queryInterface.bulkDelete('movie_genres', null, {});
        await queryInterface.bulkDelete('movies', null, {});
        await queryInterface.bulkDelete('genres', null, {});
        await queryInterface.bulkDelete('users', null, {});
    },
};
