const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Quản lý phim
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Lấy danh sách phim
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số phim mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên phim
 *       - in: query
 *         name: genre
 *         schema:
 *           type: integer
 *         description: Lọc theo ID thể loại
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Lọc theo năm
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [single, series]
 *         description: Lọc theo loại phim
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', movieController.getAllMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Lấy chi tiết phim
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của phim
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy phim
 */
router.get('/:id', movieController.getMovieById);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Thêm phim mới (Admin)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               trailerUrl:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [single, series]
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post('/', authenticate, isAdmin, movieController.createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Cập nhật phim (Admin)
 *     tags: [Movies]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               trailerUrl:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [single, series]
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authenticate, isAdmin, movieController.updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Xóa phim (Admin)
 *     tags: [Movies]
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
router.delete('/:id', authenticate, isAdmin, movieController.deleteMovie);

module.exports = router;
