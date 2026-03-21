const { Theater, Screen, Seat } = require('../../models');
const { ApiFeatures } = require('../utils');

class TheaterController {
    // Lấy danh sách rạp chiếu
    async getAllTheaters(req, res) {
        try {
            const { queryOptions, pagination } = ApiFeatures.buildListQuery(req.query, {
                searchFields: ['name', 'address'],
                defaultSort: 'name',
                defaultOrder: 'ASC',
            });

            const result = await Theater.findAndCountAll(queryOptions);

            ApiFeatures.sendPaginatedResponse(res, result, pagination);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết rạp theo ID (kèm phòng chiếu)
    async getTheaterById(req, res) {
        try {
            const theater = await Theater.findByPk(req.params.id, {
                include: [
                    {
                        model: Screen,
                        as: 'screens',
                        include: [{ model: Seat, as: 'seats' }],
                    },
                ],
            });

            if (!theater) {
                return res.status(404).json({ success: false, message: 'Theater not found' });
            }

            res.json({ success: true, data: theater });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo rạp mới (Admin)
    async createTheater(req, res) {
        try {
            const { name, address, phone } = req.body;

            const theater = await Theater.create({ name, address, phone });

            res.status(201).json({ success: true, data: theater });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật rạp (Admin)
    async updateTheater(req, res) {
        try {
            const theater = await Theater.findByPk(req.params.id);

            if (!theater) {
                return res.status(404).json({ success: false, message: 'Theater not found' });
            }

            const { name, address, phone } = req.body;
            await theater.update({ name, address, phone });

            res.json({ success: true, data: theater });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa rạp (Admin)
    async deleteTheater(req, res) {
        try {
            const theater = await Theater.findByPk(req.params.id);

            if (!theater) {
                return res.status(404).json({ success: false, message: 'Theater not found' });
            }

            await theater.destroy();
            res.json({ success: true, message: 'Theater deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new TheaterController();
