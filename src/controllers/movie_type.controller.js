const { MovieType } = require('../../models');

class MovieTypeController {
    async getAll(req, res) {
        try {
            const types = await MovieType.findAll({
                order: [['sortOrder', 'ASC'], ['name', 'ASC']],
            });
            res.json({ success: true, data: types });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { name, sortOrder } = req.body;
            const mt = await MovieType.create({ name, sortOrder });
            res.status(201).json({ success: true, data: mt });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ success: false, message: 'Loại phim này đã tồn tại' });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const mt = await MovieType.findByPk(req.params.id);
            if (!mt) return res.status(404).json({ success: false, message: 'Không tìm thấy loại phim' });
            const { name, sortOrder } = req.body;
            await mt.update({ name, sortOrder });
            res.json({ success: true, data: mt });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ success: false, message: 'Loại phim này đã tồn tại' });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const mt = await MovieType.findByPk(req.params.id);
            if (!mt) return res.status(404).json({ success: false, message: 'Không tìm thấy loại phim' });
            await mt.destroy();
            res.json({ success: true, message: 'Đã xóa loại phim' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new MovieTypeController();
