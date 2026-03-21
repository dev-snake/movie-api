const { Screen, Theater, Seat } = require('../../models');

class ScreenController {
    // Lấy danh sách phòng chiếu theo rạp
    async getScreensByTheater(req, res) {
        try {
            const { theaterId } = req.params;

            const theater = await Theater.findByPk(theaterId);
            if (!theater) {
                return res.status(404).json({ success: false, message: 'Theater not found' });
            }

            const screens = await Screen.findAll({
                where: { theaterId },
                include: [{ model: Seat, as: 'seats' }],
                order: [['name', 'ASC']],
            });

            res.json({ success: true, data: screens });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết phòng chiếu
    async getScreenById(req, res) {
        try {
            const screen = await Screen.findByPk(req.params.id, {
                include: [
                    { model: Theater, as: 'theater' },
                    { model: Seat, as: 'seats' },
                ],
            });

            if (!screen) {
                return res.status(404).json({ success: false, message: 'Screen not found' });
            }

            res.json({ success: true, data: screen });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo phòng chiếu mới với ghế tự động (Admin)
    async createScreen(req, res) {
        try {
            const { theaterId, name, rows, seatsPerRow, vipRows } = req.body;

            // Kiểm tra theater có tồn tại
            const theater = await Theater.findByPk(theaterId);
            if (!theater) {
                return res.status(404).json({ success: false, message: 'Theater not found' });
            }

            // Tính capacity
            const capacity = rows * seatsPerRow;

            // Tạo screen
            const screen = await Screen.create({ theaterId, name, capacity });

            // Tạo ghế tự động
            const seats = [];
            const vipRowList = vipRows || []; // Ví dụ: ['A', 'B']

            for (let r = 0; r < rows; r++) {
                const rowLabel = String.fromCharCode(65 + r); // A, B, C, ...
                for (let n = 1; n <= seatsPerRow; n++) {
                    seats.push({
                        screenId: screen.id,
                        row: rowLabel,
                        number: n,
                        type: vipRowList.includes(rowLabel) ? 'vip' : 'normal',
                    });
                }
            }

            await Seat.bulkCreate(seats);

            // Lấy lại screen với ghế
            const screenWithSeats = await Screen.findByPk(screen.id, {
                include: [{ model: Seat, as: 'seats' }],
            });

            res.status(201).json({ success: true, data: screenWithSeats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật phòng chiếu (Admin)
    async updateScreen(req, res) {
        try {
            const screen = await Screen.findByPk(req.params.id);

            if (!screen) {
                return res.status(404).json({ success: false, message: 'Screen not found' });
            }

            const { name } = req.body;
            await screen.update({ name });

            res.json({ success: true, data: screen });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa phòng chiếu (Admin)
    async deleteScreen(req, res) {
        try {
            const screen = await Screen.findByPk(req.params.id);

            if (!screen) {
                return res.status(404).json({ success: false, message: 'Screen not found' });
            }

            await screen.destroy();
            res.json({ success: true, message: 'Screen deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ScreenController();
