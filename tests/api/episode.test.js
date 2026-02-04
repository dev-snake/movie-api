/**
 * Episode API Tests
 * Test các endpoint episode (tập phim)
 */

const request = require('supertest');
const app = require('../../src/app');
const { Episode, Movie } = require('../../models');
const { generateToken, mockUsers } = require('../helpers');

// Mock models
jest.mock('../../models', () => ({
    Episode: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    Movie: {
        findByPk: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
}));

describe('Episode API', () => {
    let adminToken;
    let userToken;

    beforeEach(() => {
        jest.clearAllMocks();
        adminToken = generateToken(mockUsers.admin);
        userToken = generateToken(mockUsers.user);

        // Mock User.findByPk for auth middleware
        const { User } = require('../../models');
        User.findByPk.mockImplementation((id) => {
            if (id === 1) return Promise.resolve(mockUsers.admin);
            if (id === 2) return Promise.resolve(mockUsers.user);
            return Promise.resolve(null);
        });
    });

    const mockEpisode = {
        id: 1,
        movieId: 1,
        episodeNumber: 1,
        title: 'Episode 1',
        videoUrl: '/uploads/videos/episode1.mp4',
        duration: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
        update: jest.fn(),
        destroy: jest.fn(),
    };

    const mockMovie = {
        id: 1,
        title: 'Test Series',
        type: 'series',
    };

    // ==================== GET EPISODES BY MOVIE ====================
    describe('GET /api/episodes/movie/:movieId', () => {
        it('should get all episodes of a movie', async () => {
            Episode.findAll.mockResolvedValue([
                mockEpisode,
                { ...mockEpisode, id: 2, episodeNumber: 2, title: 'Episode 2' },
            ]);

            const res = await request(app).get('/api/episodes/movie/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(Episode.findAll).toHaveBeenCalledWith({
                where: { movieId: '1' },
                order: [['episodeNumber', 'ASC']],
            });
        });

        it('should return empty array if no episodes found', async () => {
            Episode.findAll.mockResolvedValue([]);

            const res = await request(app).get('/api/episodes/movie/999');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(0);
        });

        it('should return 500 on database error', async () => {
            Episode.findAll.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/episodes/movie/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== GET EPISODE BY ID ====================
    describe('GET /api/episodes/:id', () => {
        it('should get episode by ID', async () => {
            Episode.findByPk.mockResolvedValue({
                ...mockEpisode,
                movie: mockMovie,
            });

            const res = await request(app).get('/api/episodes/1');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(1);
            expect(res.body.data.title).toBe('Episode 1');
        });

        it('should return 404 if episode not found', async () => {
            Episode.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/api/episodes/999');

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('not found');
        });

        it('should return 500 on database error', async () => {
            Episode.findByPk.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/episodes/1');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== CREATE EPISODE (Admin) ====================
    describe('POST /api/episodes', () => {
        const newEpisodeData = {
            movieId: 1,
            episodeNumber: 1,
            title: 'New Episode',
            videoUrl: '/uploads/videos/new-episode.mp4',
            duration: 50,
        };

        it('should create episode successfully (admin)', async () => {
            Movie.findByPk.mockResolvedValue(mockMovie);
            Episode.create.mockResolvedValue({
                id: 1,
                ...newEpisodeData,
            });

            const res = await request(app)
                .post('/api/episodes')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newEpisodeData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('New Episode');
        });

        it('should return 404 if movie not found', async () => {
            Movie.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/episodes')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newEpisodeData);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Movie not found');
        });

        it('should return 401 without token', async () => {
            const res = await request(app).post('/api/episodes').send(newEpisodeData);

            expect(res.status).toBe(401);
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .post('/api/episodes')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newEpisodeData);

            expect(res.status).toBe(403);
        });

        it('should return 500 on database error', async () => {
            Movie.findByPk.mockResolvedValue(mockMovie);
            Episode.create.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/episodes')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newEpisodeData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== UPDATE EPISODE (Admin) ====================
    describe('PUT /api/episodes/:id', () => {
        const updateData = {
            title: 'Updated Episode Title',
            duration: 60,
        };

        it('should update episode successfully (admin)', async () => {
            const episodeWithUpdate = {
                ...mockEpisode,
                update: jest.fn().mockResolvedValue({
                    ...mockEpisode,
                    ...updateData,
                }),
            };
            Episode.findByPk.mockResolvedValue(episodeWithUpdate);

            const res = await request(app)
                .put('/api/episodes/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(episodeWithUpdate.update).toHaveBeenCalled();
        });

        it('should return 404 if episode not found', async () => {
            Episode.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/episodes/999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 without token', async () => {
            const res = await request(app).put('/api/episodes/1').send(updateData);

            expect(res.status).toBe(401);
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .put('/api/episodes/1')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(res.status).toBe(403);
        });
    });

    // ==================== DELETE EPISODE (Admin) ====================
    describe('DELETE /api/episodes/:id', () => {
        it('should delete episode successfully (admin)', async () => {
            const episodeWithDestroy = {
                ...mockEpisode,
                destroy: jest.fn().mockResolvedValue(true),
            };
            Episode.findByPk.mockResolvedValue(episodeWithDestroy);

            const res = await request(app)
                .delete('/api/episodes/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('deleted');
            expect(episodeWithDestroy.destroy).toHaveBeenCalled();
        });

        it('should return 404 if episode not found', async () => {
            Episode.findByPk.mockResolvedValue(null);

            const res = await request(app)
                .delete('/api/episodes/999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('should return 401 without token', async () => {
            const res = await request(app).delete('/api/episodes/1');

            expect(res.status).toBe(401);
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .delete('/api/episodes/1')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });

        it('should return 500 on database error', async () => {
            const episodeWithError = {
                ...mockEpisode,
                destroy: jest.fn().mockRejectedValue(new Error('Database error')),
            };
            Episode.findByPk.mockResolvedValue(episodeWithError);

            const res = await request(app)
                .delete('/api/episodes/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
