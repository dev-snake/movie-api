const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Quản lý phim yêu thích
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Lấy danh sách phim yêu thích của user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', authenticate, favoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites/{movieId}:
 *   post:
 *     summary: Thêm phim vào yêu thích
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Thêm thành công
 */
router.post('/:movieId', authenticate, favoriteController.addFavorite);

/**
 * @swagger
 * /api/favorites/{movieId}:
 *   delete:
 *     summary: Xóa phim khỏi yêu thích
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:movieId', authenticate, favoriteController.removeFavorite);

/**
 * @swagger
 * /api/favorites/check/{movieId}:
 *   get:
 *     summary: Kiểm tra phim có trong yêu thích không
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
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
router.get('/check/:movieId', authenticate, favoriteController.checkFavorite);

module.exports = router;
