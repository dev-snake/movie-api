/**
 * Comment API Tests
 * Test các endpoint comments
 */

const request = require('supertest');
const app = require('../../src/app');
const { Comment, User, Movie } = require('../../models');
const { generateToken, mockUsers, mockMovies } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    Comment: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
    Movie: {
        findByPk: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
}));

describe('Comment API', () => {
    let adminToken;
    let userToken;

    const mockComment = {
        id: 1,
        userId: 2,
        movieId: 1,
        content: 'Great movie!',
        user: {
            id: 2,
            name: 'Normal User',
            avatar: null,
        },
    };

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

    // ==================== GET COMMENTS BY MOVIE ====================
    describe('GET /api/comments/movie/:movieId', () => {
        it('should get comments for a movie', async () => {
            Comment.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: [mockComment],
            });

            const res = await request(app).get('/api/comments/movie/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.pagination).toBeDefined();
        });

        it('should return empty array when no comments', async () => {
            Comment.findAndCountAll.mockResolvedValue({
                count: 0,
                rows: [],
            });

            const res = await request(app).get('/api/comments/movie/1');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(0);
        });

        it('should support pagination', async () => {
            Comment.findAndCountAll.mockResolvedValue({
                count: 50,
                rows: [mockComment],
            });

            const res = await request(app)
                .get('/api/comments/movie/1')
                .query({ page: 2, limit: 10 });

            expect(res.status).toBe(200);
            expect(res.body.pagination.page).toBe(2);
        });
    });

    // ==================== CREATE COMMENT ====================
    describe('POST /api/comments', () => {
        const newComment = {
            movieId: 1,
            content: 'This is a new comment',
        };

        it('should create comment when authenticated', async () => {
            Movie.findByPk.mockResolvedValue(mockMovies.movie1);
            Comment.create.mockResolvedValue({
                id: 2,
                userId: mockUsers.user.id,
                ...newComment,
            });
            Comment.findByPk.mockResolvedValue({
                id: 2,
                userId: mockUsers.user.id,
                ...newComment,
                user: { id: 2, name: 'Normal User', avatar: null },
            });

            const res = await request(app)
                .post('/api/comments')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newComment);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).post('/api/comments').send(newComment);

            expect(res.status).toBe(401);
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/comments')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newComment);

            expect(res.status).toBe(404);
        });
    });

    // ==================== UPDATE COMMENT ====================
    describe('PUT /api/comments/:id', () => {
        const updateData = { content: 'Updated comment' };

        it('should update own comment', async () => {
            const mockCommentWithMethods = {
                ...mockComment,
                update: jest.fn().mockResolvedValue(true),
            };

            Comment.findByPk.mockResolvedValue(mockCommentWithMethods);

            const res = await request(app)
                .put('/api/comments/1')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 403 when updating other user comment', async () => {
            const otherUserComment = {
                ...mockComment,
                userId: 999, // Different user
            };

            Comment.findByPk.mockResolvedValue(otherUserComment);

            const res = await request(app)
                .put('/api/comments/1')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(res.status).toBe(403);
        });

        it('should return 404 if comment not found', async () => {
            Comment.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/comments/999')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(res.status).toBe(404);
        });
    });

    // ==================== DELETE COMMENT ====================
    describe('DELETE /api/comments/:id', () => {
        it('should delete own comment', async () => {
            const mockCommentWithMethods = {
                ...mockComment,
                destroy: jest.fn().mockResolvedValue(true),
            };

            Comment.findByPk.mockResolvedValue(mockCommentWithMethods);

            const res = await request(app)
                .delete('/api/comments/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should allow admin to delete any comment', async () => {
            const mockCommentWithMethods = {
                ...mockComment,
                userId: 999, // Different user
                destroy: jest.fn().mockResolvedValue(true),
            };

            Comment.findByPk.mockResolvedValue(mockCommentWithMethods);

            const res = await request(app)
                .delete('/api/comments/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 403 when deleting other user comment as normal user', async () => {
            const otherUserComment = {
                ...mockComment,
                userId: 999,
            };

            Comment.findByPk.mockResolvedValue(otherUserComment);

            const res = await request(app)
                .delete('/api/comments/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });
});
