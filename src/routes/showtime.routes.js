const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtime.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Quản lý lịch chiếu phim
 */

/**
 * @swagger
 * /api/showtimes:
 *   get:
 *     summary: Lấy danh sách lịch chiếu
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *         description: Lọc theo phim
 *       - in: query
 *         name: theaterId
 *         schema:
 *           type: integer
 *         description: Lọc theo rạp
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc theo ngày (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', showtimeController.getAllShowtimes);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch chiếu (kèm ghế + trạng thái đã đặt)
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công (danh sách ghế có isBooked = true/false)
 *       404:
 *         description: Không tìm thấy lịch chiếu
 */
router.get('/:id', showtimeController.getShowtimeById);

/**
 * @swagger
 * /api/showtimes:
 *   post:
 *     summary: Tạo lịch chiếu mới (Admin)
 *     tags: [Showtimes]
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
 *               - screenId
 *               - startTime
 *               - price
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: ID của phim
 *               screenId:
 *                 type: integer
 *                 description: ID của phòng chiếu
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian bắt đầu chiếu
 *               price:
 *                 type: number
 *                 description: Giá vé (ghế thường)
 *           example:
 *             movieId: 1
 *             screenId: 1
 *             startTime: "2026-03-22T19:00:00Z"
 *             price: 90000
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Trùng lịch chiếu
 *       404:
 *         description: Không tìm thấy phim hoặc phòng chiếu
 */
router.post('/', authenticate, isAdmin, showtimeController.createShowtime);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   put:
 *     summary: Cập nhật lịch chiếu (Admin)
 *     tags: [Showtimes]
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
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Trùng lịch chiếu
 */
router.put('/:id', authenticate, isAdmin, showtimeController.updateShowtime);

/**
 * @swagger
 * /api/showtimes/{id}:
 *   delete:
 *     summary: Hủy lịch chiếu (Admin)
 *     tags: [Showtimes]
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
 *         description: Hủy thành công
 */
router.delete('/:id', authenticate, isAdmin, showtimeController.deleteShowtime);

module.exports = router;
