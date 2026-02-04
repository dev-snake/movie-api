/**
 * Upload API Tests
 * Test các endpoint upload file
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../../src/app');
const { Movie, Episode, User } = require('../../models');
const { generateToken, mockUsers } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    Movie: {
        findByPk: jest.fn(),
    },
    Episode: {
        findByPk: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
}));

describe('Upload API', () => {
    let adminToken;
    let userToken;
    const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
    const testVideoPath = path.join(__dirname, '../fixtures/test-video.mp4');

    beforeAll(() => {
        // Tạo thư mục fixtures nếu chưa có
        const fixturesDir = path.join(__dirname, '../fixtures');
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
        }

        // Tạo test image file (1x1 pixel JPEG)
        const jpegBuffer = Buffer.from([
            0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00,
            0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06,
            0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d,
            0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d,
            0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28,
            0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
            0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 0x01,
            0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
            0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02,
            0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10,
            0x00, 0x02, 0x01, 0x03, 0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00,
            0x01, 0x7d, 0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
            0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42,
            0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
            0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35, 0x36, 0x37,
            0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55,
            0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73,
            0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
            0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba,
            0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6,
            0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
            0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xff, 0xda, 0x00, 0x08,
            0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xfb, 0xd5, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xff, 0xd9,
        ]);
        fs.writeFileSync(testImagePath, jpegBuffer);

        // Tạo minimal MP4 file
        const mp4Buffer = Buffer.from([
            0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00,
            0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32, 0x6d, 0x70, 0x34, 0x31,
        ]);
        fs.writeFileSync(testVideoPath, mp4Buffer);
    });

    afterAll(() => {
        // Cleanup test files
        if (fs.existsSync(testImagePath)) fs.unlinkSync(testImagePath);
        if (fs.existsSync(testVideoPath)) fs.unlinkSync(testVideoPath);

        // Cleanup uploaded files
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const folders = ['images', 'posters', 'videos'];
        folders.forEach((folder) => {
            const folderPath = path.join(uploadsDir, folder);
            if (fs.existsSync(folderPath)) {
                fs.readdirSync(folderPath).forEach((file) => {
                    if (file !== '.gitkeep') {
                        fs.unlinkSync(path.join(folderPath, file));
                    }
                });
            }
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        adminToken = generateToken(mockUsers.admin);
        userToken = generateToken(mockUsers.user);

        // Mock User.findByPk for auth middleware
        User.findByPk.mockImplementation((id) => {
            if (id === 1) return Promise.resolve(mockUsers.admin);
            if (id === 2) return Promise.resolve(mockUsers.user);
            return Promise.resolve(null);
        });
    });

    // ==================== UPLOAD IMAGE ====================
    describe('POST /api/upload/image', () => {
        it('should upload image successfully', async () => {
            const res = await request(app)
                .post('/api/upload/image')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('image', testImagePath);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('uploaded');
            expect(res.body.data).toHaveProperty('filename');
            expect(res.body.data).toHaveProperty('url');
        });

        it('should return 400 if no file uploaded', async () => {
            const res = await request(app)
                .post('/api/upload/image')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('No file');
        });

        it('should return 401 without token', async () => {
            const res = await request(app).post('/api/upload/image');

            expect(res.status).toBe(401);
        });
    });

    // ==================== UPLOAD POSTER ====================
    describe('POST /api/upload/poster', () => {
        it('should upload poster successfully', async () => {
            const res = await request(app)
                .post('/api/upload/poster')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('poster', testImagePath);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('filename');
            expect(res.body.data.path).toContain('posters');
        });

        it('should return 400 if no file uploaded', async () => {
            const res = await request(app)
                .post('/api/upload/poster')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== UPLOAD VIDEO ====================
    describe('POST /api/upload/video', () => {
        it('should upload video successfully', async () => {
            const res = await request(app)
                .post('/api/upload/video')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('video', testVideoPath);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('filename');
        });

        it('should return 400 if no file uploaded', async () => {
            const res = await request(app)
                .post('/api/upload/video')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== UPLOAD MOVIE POSTER ====================
    describe('POST /api/upload/movie/:movieId/poster', () => {
        const mockMovie = {
            id: 1,
            title: 'Test Movie',
            posterUrl: null,
            update: jest.fn().mockResolvedValue(true),
        };

        it('should upload poster and update movie successfully', async () => {
            Movie.findByPk.mockResolvedValue(mockMovie);

            const res = await request(app)
                .post('/api/upload/movie/1/poster')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('poster', testImagePath);

            // Returns 201 when file uploaded successfully, 200 when updating existing
            expect([200, 201]).toContain(res.status);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/upload/movie/999/poster')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('poster', testImagePath);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Movie not found');
        });

        it('should return 400 if no file uploaded', async () => {
            Movie.findByPk.mockResolvedValue(mockMovie);

            const res = await request(app)
                .post('/api/upload/movie/1/poster')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== UPLOAD EPISODE VIDEO ====================
    describe('POST /api/upload/episode/:episodeId/video', () => {
        const mockEpisode = {
            id: 1,
            movieId: 1,
            episodeNumber: 1,
            title: 'Episode 1',
            videoUrl: null,
            update: jest.fn().mockResolvedValue(true),
        };

        it('should upload video and update episode successfully', async () => {
            Episode.findByPk.mockResolvedValue(mockEpisode);

            const res = await request(app)
                .post('/api/upload/episode/1/video')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('video', testVideoPath);

            expect([200, 201]).toContain(res.status);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 if episode not found', async () => {
            Episode.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/upload/episode/999/video')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('video', testVideoPath);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Episode not found');
        });

        it('should return 400 if no file uploaded', async () => {
            Episode.findByPk.mockResolvedValue(mockEpisode);

            const res = await request(app)
                .post('/api/upload/episode/1/video')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== UPLOAD AVATAR ====================
    describe('POST /api/upload/avatar', () => {
        const mockUser = {
            id: 1,
            name: 'Test User',
            avatar: null,
            role: 'admin',
            update: jest.fn().mockResolvedValue(true),
        };

        it('should upload avatar and update user successfully', async () => {
            User.findByPk.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/upload/avatar')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('avatar', testImagePath);

            expect([200, 201]).toContain(res.status);
            expect(res.body.success).toBe(true);
        });

        it('should return 400 if no file uploaded', async () => {
            const res = await request(app)
                .post('/api/upload/avatar')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 without token', async () => {
            const res = await request(app).post('/api/upload/avatar');

            expect(res.status).toBe(401);
        });
    });

    // ==================== DELETE FILE ====================
    describe('DELETE /api/upload/:filename', () => {
        it('should return 404 if file not found', async () => {
            const res = await request(app)
                .delete('/api/upload/nonexistent-file.jpg')
                .set('Authorization', `Bearer ${adminToken}`)
                .query({ folder: 'images' });

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 without token', async () => {
            const res = await request(app).delete('/api/upload/test.jpg');

            expect(res.status).toBe(401);
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .delete('/api/upload/test.jpg')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });
});
