const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Quản lý đặt vé
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Đặt vé xem phim
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seatIds
 *             properties:
 *               showtimeId:
 *                 type: integer
 *                 description: ID của lịch chiếu
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Danh sách ID ghế muốn đặt
 *           example:
 *             showtimeId: 1
 *             seatIds: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Đặt vé thành công
 *       400:
 *         description: Ghế đã được đặt hoặc lịch chiếu đã bắt đầu
 *       404:
 *         description: Không tìm thấy lịch chiếu
 */
router.post('/', authenticate, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Lấy lịch sử đặt vé của tôi
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/my', authenticate, bookingController.getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Lấy chi tiết booking
 *     tags: [Bookings]
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
 *         description: Thành công
 *       403:
 *         description: Không có quyền xem booking này
 *       404:
 *         description: Không tìm thấy booking
 */
router.get('/:id', authenticate, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Hủy booking (trước giờ chiếu)
 *     tags: [Bookings]
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
 *       400:
 *         description: Không thể hủy sau giờ chiếu
 *       403:
 *         description: Không có quyền hủy booking này
 */
router.delete('/:id', authenticate, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Lấy tất cả bookings (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', authenticate, isAdmin, bookingController.getAllBookings);

module.exports = router;
