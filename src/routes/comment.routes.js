const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Quản lý bình luận
 */

/**
 * @swagger
 * /api/comments/movie/{movieId}:
 *   get:
 *     summary: Lấy danh sách bình luận theo phim
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/movie/:movieId', commentController.getCommentsByMovie);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Thêm bình luận mới
 *     tags: [Comments]
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
 *               - content
 *             properties:
 *               movieId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authenticate, commentController.createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Sửa bình luận (chỉ chủ comment)
 *     tags: [Comments]
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authenticate, commentController.updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Xóa bình luận (chủ comment hoặc admin)
 *     tags: [Comments]
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
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
