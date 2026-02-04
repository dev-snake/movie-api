const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episode.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Episodes
 *   description: Quản lý tập phim
 */

/**
 * @swagger
 * /api/episodes/movie/{movieId}:
 *   get:
 *     summary: Lấy danh sách tập phim theo movie
 *     tags: [Episodes]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/movie/:movieId', episodeController.getEpisodesByMovie);

/**
 * @swagger
 * /api/episodes/{id}:
 *   get:
 *     summary: Lấy chi tiết tập phim
 *     tags: [Episodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id', episodeController.getEpisodeById);

/**
 * @swagger
 * /api/episodes:
 *   post:
 *     summary: Thêm tập phim mới (Admin)
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - episodeNumber
 *             properties:
 *               movieId:
 *                 type: integer
 *               episodeNumber:
 *                 type: integer
 *               title:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authenticate, isAdmin, episodeController.createEpisode);

/**
 * @swagger
 * /api/episodes/{id}:
 *   put:
 *     summary: Cập nhật tập phim (Admin)
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               episodeNumber:
 *                 type: integer
 *               title:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authenticate, isAdmin, episodeController.updateEpisode);

/**
 * @swagger
 * /api/episodes/{id}:
 *   delete:
 *     summary: Xóa tập phim (Admin)
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', authenticate, isAdmin, episodeController.deleteEpisode);

module.exports = router;
