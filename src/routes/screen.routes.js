const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screen.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Screens
 *   description: Quản lý phòng chiếu
 */

/**
 * @swagger
 * /api/screens/theater/{theaterId}:
 *   get:
 *     summary: Lấy danh sách phòng chiếu theo rạp
 *     tags: [Screens]
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy rạp
 */
router.get('/theater/:theaterId', screenController.getScreensByTheater);

/**
 * @swagger
 * /api/screens/{id}:
 *   get:
 *     summary: Lấy chi tiết phòng chiếu (kèm ghế)
 *     tags: [Screens]
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
 *         description: Không tìm thấy phòng chiếu
 */
router.get('/:id', screenController.getScreenById);

/**
 * @swagger
 * /api/screens:
 *   post:
 *     summary: Tạo phòng chiếu với ghế tự động (Admin)
 *     tags: [Screens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theaterId
 *               - name
 *               - rows
 *               - seatsPerRow
 *             properties:
 *               theaterId:
 *                 type: integer
 *                 description: ID của rạp
 *               name:
 *                 type: string
 *                 description: "Tên phòng chiếu (VD: Phòng 1)"
 *               rows:
 *                 type: integer
 *                 description: "Số hàng ghế (VD: 8 hàng từ A-H)"
 *               seatsPerRow:
 *                 type: integer
 *                 description: "Số ghế mỗi hàng (VD: 12)"
 *               vipRows:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Các hàng VIP (VD: [\"A\", \"B\"])"
 *           example:
 *             theaterId: 1
 *             name: "Phòng 1"
 *             rows: 8
 *             seatsPerRow: 12
 *             vipRows: ["D", "E", "F"]
 *     responses:
 *       201:
 *         description: Tạo thành công (kèm danh sách ghế)
 *       404:
 *         description: Không tìm thấy rạp
 */
router.post('/', authenticate, isAdmin, screenController.createScreen);

/**
 * @swagger
 * /api/screens/{id}:
 *   put:
 *     summary: Cập nhật phòng chiếu (Admin)
 *     tags: [Screens]
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
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authenticate, isAdmin, screenController.updateScreen);

/**
 * @swagger
 * /api/screens/{id}:
 *   delete:
 *     summary: Xóa phòng chiếu (Admin)
 *     tags: [Screens]
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
router.delete('/:id', authenticate, isAdmin, screenController.deleteScreen);

module.exports = router;
