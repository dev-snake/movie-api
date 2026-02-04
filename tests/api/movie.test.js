/**
 * Movie API Tests
 * Test các endpoint movies
 */

const request = require('supertest');
const app = require('../../src/app');
const { Movie, Genre, Episode, User } = require('../../models');
const { generateToken, mockUsers, mockMovies, mockGenres } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    Movie: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
    Genre: {
        findAll: jest.fn(),
    },
    Episode: {
        findAll: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
}));

describe('Movie API', () => {
    let adminToken;
    let userToken;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup tokens
        adminToken = generateToken(mockUsers.admin);
        userToken = generateToken(mockUsers.user);

        // Mock User.findByPk cho auth middleware
        User.findByPk.mockImplementation((id) => {
            if (id === mockUsers.admin.id) return Promise.resolve(mockUsers.admin);
            if (id === mockUsers.user.id) return Promise.resolve(mockUsers.user);
            return Promise.resolve(null);
        });
    });

    // ==================== GET ALL MOVIES ====================
    describe('GET /api/movies', () => {
        it('should get all movies with pagination', async () => {
            const mockResult = {
                count: 2,
                rows: [mockMovies.movie1, mockMovies.movie2],
            };

            Movie.findAndCountAll.mockResolvedValue(mockResult);

            const res = await request(app).get('/api/movies');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination).toBeDefined();
            expect(res.body.pagination.total).toBe(2);
        });

        it('should filter movies by search query', async () => {
            Movie.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: [mockMovies.movie1],
            });

            const res = await request(app).get('/api/movies').query({ search: 'Test Movie 1' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Movie.findAndCountAll).toHaveBeenCalled();
        });

        it('should filter movies by year', async () => {
            Movie.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: [mockMovies.movie1],
            });

            const res = await request(app).get('/api/movies').query({ releaseYear: 2024 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should paginate results', async () => {
            Movie.findAndCountAll.mockResolvedValue({
                count: 50,
                rows: [mockMovies.movie1],
            });

            const res = await request(app).get('/api/movies').query({ page: 2, limit: 10 });

            expect(res.status).toBe(200);
            expect(res.body.pagination.page).toBe(2);
            expect(res.body.pagination.limit).toBe(10);
        });
    });

    // ==================== GET MOVIE BY ID ====================
    describe('GET /api/movies/:id', () => {
        it('should get movie by ID', async () => {
            const mockMovie = {
                ...mockMovies.movie1,
                genres: [mockGenres.genre1],
                episodes: [],
                increment: jest.fn(),
            };

            Movie.findByPk.mockResolvedValue(mockMovie);

            const res = await request(app).get('/api/movies/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(mockMovies.movie1.title);
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/api/movies/999');

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== CREATE MOVIE (Admin) ====================
    describe('POST /api/movies', () => {
        const newMovie = {
            title: 'New Movie',
            description: 'New movie description',
            releaseYear: 2025,
            duration: 120,
            type: 'single',
        };

        it('should create movie when admin authenticated', async () => {
            const createdMovie = { id: 3, ...newMovie, slug: 'new-movie' };

            Movie.create.mockResolvedValue(createdMovie);
            Movie.findByPk.mockResolvedValue({
                ...createdMovie,
                genres: [],
                setGenres: jest.fn(),
            });

            const res = await request(app)
                .post('/api/movies')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newMovie);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).post('/api/movies').send(newMovie);

            expect(res.status).toBe(401);
        });

        it('should return 403 when user (not admin) tries to create', async () => {
            const res = await request(app)
                .post('/api/movies')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newMovie);

            expect(res.status).toBe(403);
        });
    });

    // ==================== UPDATE MOVIE (Admin) ====================
    describe('PUT /api/movies/:id', () => {
        const updateData = {
            title: 'Updated Movie Title',
            description: 'Updated description',
        };

        it('should update movie when admin authenticated', async () => {
            const mockMovie = {
                ...mockMovies.movie1,
                update: jest.fn().mockResolvedValue(true),
                setGenres: jest.fn(),
            };

            Movie.findByPk
                .mockResolvedValueOnce(mockMovie) // First call - find movie
                .mockResolvedValueOnce({ ...mockMovie, ...updateData, genres: [] }); // Second call - return updated

            const res = await request(app)
                .put('/api/movies/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/movies/999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.status).toBe(404);
        });
    });

    // ==================== DELETE MOVIE (Admin) ====================
    describe('DELETE /api/movies/:id', () => {
        it('should delete movie when admin authenticated', async () => {
            const mockMovie = {
                ...mockMovies.movie1,
                destroy: jest.fn().mockResolvedValue(true),
            };

            Movie.findByPk.mockResolvedValue(mockMovie);

            const res = await request(app)
                .delete('/api/movies/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockMovie.destroy).toHaveBeenCalled();
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/movies/999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
        });

        it('should return 403 when normal user tries to delete', async () => {
            const res = await request(app)
                .delete('/api/movies/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });
});
