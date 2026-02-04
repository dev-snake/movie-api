/**
 * Test Helpers
 * Các hàm helper dùng chung cho tests
 */

const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token cho testing
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'test-secret-key', {
        expiresIn: '1h',
    });
};

/**
 * Tạo mock user data
 */
const mockUsers = {
    admin: {
        id: 1,
        name: 'Admin User',
        email: 'admin@test.com',
        password: '$2a$10$abcdefghijklmnopqrstuv', // hashed password
        role: 'admin',
    },
    user: {
        id: 2,
        name: 'Normal User',
        email: 'user@test.com',
        password: '$2a$10$abcdefghijklmnopqrstuv',
        role: 'user',
    },
};

/**
 * Tạo mock movie data
 */
const mockMovies = {
    movie1: {
        id: 1,
        title: 'Test Movie 1',
        slug: 'test-movie-1',
        description: 'Description for test movie 1',
        posterUrl: 'https://example.com/poster1.jpg',
        trailerUrl: 'https://youtube.com/watch?v=abc123',
        releaseYear: 2024,
        duration: 120,
        rating: 8.5,
        views: 1000,
        type: 'single',
        status: 'published',
    },
    movie2: {
        id: 2,
        title: 'Test Movie 2',
        slug: 'test-movie-2',
        description: 'Description for test movie 2',
        posterUrl: 'https://example.com/poster2.jpg',
        trailerUrl: 'https://youtube.com/watch?v=def456',
        releaseYear: 2023,
        duration: 150,
        rating: 7.8,
        views: 500,
        type: 'series',
        status: 'published',
    },
};

/**
 * Tạo mock genre data
 */
const mockGenres = {
    genre1: {
        id: 1,
        name: 'Action',
        slug: 'action',
        description: 'Action movies',
    },
    genre2: {
        id: 2,
        name: 'Comedy',
        slug: 'comedy',
        description: 'Comedy movies',
    },
};

/**
 * Generate auth header với token
 * @param {Object} user
 * @returns {Object} Header object
 */
const getAuthHeader = (user) => {
    const token = generateToken(user);
    return { Authorization: `Bearer ${token}` };
};

module.exports = {
    generateToken,
    mockUsers,
    mockMovies,
    mockGenres,
    getAuthHeader,
};
