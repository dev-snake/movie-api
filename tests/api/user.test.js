/**
 * User API Tests
 * Test các endpoint users
 */

const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../models');
const { generateToken, mockUsers } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    User: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
    },
}));

describe('User API', () => {
    let adminToken;
    let userToken;

    beforeEach(() => {
        jest.clearAllMocks();

        adminToken = generateToken(mockUsers.admin);
        userToken = generateToken(mockUsers.user);

        // Default mock - convert id to number for comparison
        User.findByPk.mockImplementation((id, options) => {
            const numId = typeof id === 'string' ? parseInt(id) : id;
            if (numId === mockUsers.admin.id) return Promise.resolve(mockUsers.admin);
            if (numId === mockUsers.user.id) return Promise.resolve(mockUsers.user);
            return Promise.resolve(null);
        });
    });

    // ==================== GET PROFILE ====================
    describe('GET /api/users/profile', () => {
        it('should get user profile when authenticated', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(mockUsers.user.email);
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).get('/api/users/profile');

            expect(res.status).toBe(401);
        });

        it('should return 401 with invalid token', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.status).toBe(401);
        });
    });

    // ==================== UPDATE PROFILE ====================
    describe('PUT /api/users/profile', () => {
        const updateData = {
            name: 'Updated Name',
        };

        it('should update profile when authenticated', async () => {
            const mockUser = {
                ...mockUsers.user,
                update: jest.fn().mockResolvedValue(true),
            };

            User.findByPk.mockResolvedValue(mockUser);

            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).put('/api/users/profile').send(updateData);

            expect(res.status).toBe(401);
        });
    });

    // ==================== GET ALL USERS (Admin) ====================
    describe('GET /api/users', () => {
        it('should get all users when admin authenticated', async () => {
            User.findAndCountAll.mockResolvedValue({
                count: 2,
                rows: [
                    { ...mockUsers.admin, password: undefined },
                    { ...mockUsers.user, password: undefined },
                ],
            });

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination).toBeDefined();
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });

        it('should support pagination', async () => {
            User.findAndCountAll.mockResolvedValue({
                count: 50,
                rows: [{ ...mockUsers.user, password: undefined }],
            });

            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .query({ page: 2, limit: 10 });

            expect(res.status).toBe(200);
            expect(res.body.pagination.page).toBe(2);
        });
    });

    // ==================== GET USER BY ID (Admin) ====================
    describe('GET /api/users/:id', () => {
        it('should get user by ID when admin authenticated', async () => {
            // Convert string id to number for comparison
            User.findByPk.mockImplementation((id, options) => {
                const numId = typeof id === 'string' ? parseInt(id) : id;
                if (numId === mockUsers.admin.id || numId === 1)
                    return Promise.resolve(mockUsers.admin);
                if (numId === mockUsers.user.id || numId === 2)
                    return Promise.resolve(mockUsers.user);
                return Promise.resolve(null);
            });

            const res = await request(app)
                .get('/api/users/2')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if user not found', async () => {
            User.findByPk.mockImplementation((id, options) => {
                const numId = typeof id === 'string' ? parseInt(id) : id;
                // Chỉ trả về admin cho auth middleware
                if (numId === mockUsers.admin.id || numId === 1)
                    return Promise.resolve(mockUsers.admin);
                // Mọi user khác trả về null
                return Promise.resolve(null);
            });

            const res = await request(app)
                .get('/api/users/999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
        });
    });

    // ==================== DELETE USER (Admin) ====================
    describe('DELETE /api/users/:id', () => {
        it('should delete user when admin authenticated', async () => {
            const mockUser = {
                ...mockUsers.user,
                id: 2,
                destroy: jest.fn().mockResolvedValue(true),
            };

            User.findByPk.mockImplementation((id, options) => {
                const numId = typeof id === 'string' ? parseInt(id) : id;
                if (numId === mockUsers.admin.id || numId === 1)
                    return Promise.resolve(mockUsers.admin);
                if (numId === 2) return Promise.resolve(mockUser);
                return Promise.resolve(null);
            });

            const res = await request(app)
                .delete('/api/users/2')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should not allow admin to delete themselves', async () => {
            const mockAdmin = {
                ...mockUsers.admin,
                id: 1,
                destroy: jest.fn(),
            };

            User.findByPk.mockImplementation((id, options) => {
                const numId = typeof id === 'string' ? parseInt(id) : id;
                if (numId === 1 || numId === mockUsers.admin.id) return Promise.resolve(mockAdmin);
                return Promise.resolve(null);
            });

            const res = await request(app)
                .delete('/api/users/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('yourself');
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .delete('/api/users/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });
});
