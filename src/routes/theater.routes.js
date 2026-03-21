const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theater.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Theaters
 *   description: Quản lý rạp chiếu phim
 */

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Lấy danh sách rạp chiếu
 *     tags: [Theaters]
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo tên hoặc địa chỉ
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', theaterController.getAllTheaters);

/**
 * @swagger
 * /api/theaters/{id}:
 *   get:
 *     summary: Lấy chi tiết rạp (kèm phòng chiếu và ghế)
 *     tags: [Theaters]
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
 *         description: Không tìm thấy rạp
 */
router.get('/:id', theaterController.getTheaterById);

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Thêm rạp mới (Admin)
 *     tags: [Theaters]
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
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post('/', authenticate, isAdmin, theaterController.createTheater);

/**
 * @swagger
 * /api/theaters/{id}:
 *   put:
 *     summary: Cập nhật rạp (Admin)
 *     tags: [Theaters]
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authenticate, isAdmin, theaterController.updateTheater);

/**
 * @swagger
 * /api/theaters/{id}:
 *   delete:
 *     summary: Xóa rạp (Admin)
 *     tags: [Theaters]
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
router.delete('/:id', authenticate, isAdmin, theaterController.deleteTheater);

module.exports = router;
