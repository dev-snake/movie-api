const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Quản lý thể loại phim
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Lấy danh sách thể loại
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', genreController.getAllGenres);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Lấy chi tiết thể loại
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', genreController.getGenreById);

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Thêm thể loại mới (Admin)
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authenticate, isAdmin, genreController.createGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Cập nhật thể loại (Admin)
 *     tags: [Genres]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authenticate, isAdmin, genreController.updateGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Xóa thể loại (Admin)
 *     tags: [Genres]
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
router.delete('/:id', authenticate, isAdmin, genreController.deleteGenre);

module.exports = router;
