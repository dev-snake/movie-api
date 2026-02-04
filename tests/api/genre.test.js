/**
 * Genre API Tests
 * Test các endpoint genres
 */

const request = require('supertest');
const app = require('../../src/app');
const { Genre, User } = require('../../models');
const { generateToken, mockUsers, mockGenres } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    Genre: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
}));

describe('Genre API', () => {
    let adminToken;
    let userToken;

    beforeEach(() => {
        jest.clearAllMocks();

        adminToken = generateToken(mockUsers.admin);
        userToken = generateToken(mockUsers.user);

        User.findByPk.mockImplementation((id) => {
            if (id === mockUsers.admin.id) return Promise.resolve(mockUsers.admin);
            if (id === mockUsers.user.id) return Promise.resolve(mockUsers.user);
            return Promise.resolve(null);
        });
    });

    // ==================== GET ALL GENRES ====================
    describe('GET /api/genres', () => {
        it('should get all genres', async () => {
            Genre.findAll.mockResolvedValue([mockGenres.genre1, mockGenres.genre2]);

            const res = await request(app).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
        });

        it('should return empty array when no genres', async () => {
            Genre.findAll.mockResolvedValue([]);

            const res = await request(app).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(0);
        });
    });

    // ==================== GET GENRE BY ID ====================
    describe('GET /api/genres/:id', () => {
        it('should get genre by ID', async () => {
            Genre.findByPk.mockResolvedValue(mockGenres.genre1);

            const res = await request(app).get('/api/genres/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(mockGenres.genre1.name);
        });

        it('should return 404 if genre not found', async () => {
            Genre.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/api/genres/999');

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== CREATE GENRE (Admin) ====================
    describe('POST /api/genres', () => {
        const newGenre = {
            name: 'Horror',
            description: 'Horror movies',
        };

        it('should create genre when admin authenticated', async () => {
            Genre.create.mockResolvedValue({ id: 3, ...newGenre, slug: 'horror' });

            const res = await request(app)
                .post('/api/genres')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newGenre);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(newGenre.name);
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).post('/api/genres').send(newGenre);

            expect(res.status).toBe(401);
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .post('/api/genres')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newGenre);

            expect(res.status).toBe(403);
        });
    });

    // ==================== UPDATE GENRE (Admin) ====================
    describe('PUT /api/genres/:id', () => {
        const updateData = {
            name: 'Updated Genre',
            description: 'Updated description',
        };

        it('should update genre when admin authenticated', async () => {
            const mockGenre = {
                ...mockGenres.genre1,
                update: jest.fn().mockResolvedValue(true),
            };

            Genre.findByPk.mockResolvedValue(mockGenre);

            const res = await request(app)
                .put('/api/genres/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockGenre.update).toHaveBeenCalledWith(updateData);
        });

        it('should return 404 if genre not found', async () => {
            Genre.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/genres/999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.status).toBe(404);
        });
    });

    // ==================== DELETE GENRE (Admin) ====================
    describe('DELETE /api/genres/:id', () => {
        it('should delete genre when admin authenticated', async () => {
            const mockGenre = {
                ...mockGenres.genre1,
                destroy: jest.fn().mockResolvedValue(true),
            };

            Genre.findByPk.mockResolvedValue(mockGenre);

            const res = await request(app)
                .delete('/api/genres/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockGenre.destroy).toHaveBeenCalled();
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .delete('/api/genres/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });
});
