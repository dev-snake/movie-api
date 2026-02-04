/**
 * Favorite API Tests
 * Test các endpoint favorites
 */

const request = require('supertest');
const app = require('../../src/app');
const { Favorite, Movie, Genre, User } = require('../../models');
const { generateToken, mockUsers, mockMovies } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    Favorite: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
    Movie: {
        findByPk: jest.fn(),
    },
    Genre: {},
    User: {
        findByPk: jest.fn(),
    },
}));

describe('Favorite API', () => {
    let userToken;

    beforeEach(() => {
        jest.clearAllMocks();

        userToken = generateToken(mockUsers.user);

        User.findByPk.mockImplementation((id) => {
            if (id === mockUsers.user.id) return Promise.resolve(mockUsers.user);
            return Promise.resolve(null);
        });
    });

    // ==================== GET FAVORITES ====================
    describe('GET /api/favorites', () => {
        it('should get user favorites when authenticated', async () => {
            Favorite.findAll.mockResolvedValue([
                {
                    id: 1,
                    userId: mockUsers.user.id,
                    movieId: mockMovies.movie1.id,
                    movie: mockMovies.movie1,
                },
            ]);

            const res = await request(app)
                .get('/api/favorites')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).get('/api/favorites');

            expect(res.status).toBe(401);
        });

        it('should return empty array when no favorites', async () => {
            Favorite.findAll.mockResolvedValue([]);

            const res = await request(app)
                .get('/api/favorites')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(0);
        });
    });

    // ==================== ADD FAVORITE ====================
    describe('POST /api/favorites/:movieId', () => {
        it('should add movie to favorites', async () => {
            Movie.findByPk.mockResolvedValue(mockMovies.movie1);
            Favorite.findOne.mockResolvedValue(null);
            Favorite.create.mockResolvedValue({
                id: 1,
                userId: mockUsers.user.id,
                movieId: mockMovies.movie1.id,
            });

            const res = await request(app)
                .post('/api/favorites/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/favorites/999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(404);
        });

        it('should return 400 if already in favorites', async () => {
            Movie.findByPk.mockResolvedValue(mockMovies.movie1);
            Favorite.findOne.mockResolvedValue({
                id: 1,
                userId: mockUsers.user.id,
                movieId: mockMovies.movie1.id,
            });

            const res = await request(app)
                .post('/api/favorites/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('already');
        });
    });

    // ==================== REMOVE FAVORITE ====================
    describe('DELETE /api/favorites/:movieId', () => {
        it('should remove movie from favorites', async () => {
            const mockFavorite = {
                id: 1,
                userId: mockUsers.user.id,
                movieId: mockMovies.movie1.id,
                destroy: jest.fn().mockResolvedValue(true),
            };

            Favorite.findOne.mockResolvedValue(mockFavorite);

            const res = await request(app)
                .delete('/api/favorites/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockFavorite.destroy).toHaveBeenCalled();
        });

        it('should return 404 if favorite not found', async () => {
            Favorite.findOne.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/favorites/999')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(404);
        });
    });

    // ==================== CHECK FAVORITE ====================
    describe('GET /api/favorites/check/:movieId', () => {
        it('should return true if movie is in favorites', async () => {
            Favorite.findOne.mockResolvedValue({
                id: 1,
                userId: mockUsers.user.id,
                movieId: mockMovies.movie1.id,
            });

            const res = await request(app)
                .get('/api/favorites/check/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.isFavorite).toBe(true);
        });

        it('should return false if movie is not in favorites', async () => {
            Favorite.findOne.mockResolvedValue(null);

            const res = await request(app)
                .get('/api/favorites/check/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.isFavorite).toBe(false);
        });
    });
});
