/**
 * Auth API Tests
 * Test các endpoint authentication
 */

const request = require('supertest');
const app = require('../../src/app');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const { generateToken, mockUsers } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    User: {
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
}));

describe('Auth API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== REGISTER ====================
    describe('POST /api/auth/register', () => {
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        it('should register a new user successfully', async () => {
            // Mock: email chưa tồn tại
            User.findOne.mockResolvedValue(null);

            // Mock: tạo user thành công
            User.create.mockResolvedValue({
                id: 1,
                name: registerData.name,
                email: registerData.email,
                role: 'user',
            });

            const res = await request(app).post('/api/auth/register').send(registerData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user).toHaveProperty('email', registerData.email);
        });

        it('should return 400 if email already exists', async () => {
            // Mock: email đã tồn tại
            User.findOne.mockResolvedValue({ id: 1, email: registerData.email });

            const res = await request(app).post('/api/auth/register').send(registerData);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('already');
        });

        it('should return 500 on database error', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/api/auth/register').send(registerData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== LOGIN ====================
    describe('POST /api/auth/login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should login successfully with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash(loginData.password, 10);

            // Mock: tìm thấy user
            User.findOne.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: loginData.email,
                password: hashedPassword,
                role: 'user',
            });

            const res = await request(app).post('/api/auth/login').send(loginData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user).toHaveProperty('email', loginData.email);
        });

        it('should return 401 with invalid email', async () => {
            // Mock: không tìm thấy user
            User.findOne.mockResolvedValue(null);

            const res = await request(app).post('/api/auth/login').send(loginData);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Invalid');
        });

        it('should return 401 with wrong password', async () => {
            const hashedPassword = await bcrypt.hash('wrongpassword', 10);

            User.findOne.mockResolvedValue({
                id: 1,
                email: loginData.email,
                password: hashedPassword,
                role: 'user',
            });

            const res = await request(app).post('/api/auth/login').send(loginData);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
