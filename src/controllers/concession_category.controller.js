const { ConcessionCategory } = require('../../models');

class ConcessionCategoryController {
    async getAll(req, res) {
        try {
            const categories = await ConcessionCategory.findAll({
                order: [['sortOrder', 'ASC'], ['name', 'ASC']],
            });
            res.json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { name, color, sortOrder } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc' });

            const category = await ConcessionCategory.create({ name, color, sortOrder });
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ success: false, message: 'Danh mục đã tồn tại' });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const category = await ConcessionCategory.findByPk(req.params.id);
            if (!category) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });

            const { name, color, sortOrder } = req.body;
            await category.update({ name, color, sortOrder });
            res.json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const category = await ConcessionCategory.findByPk(req.params.id);
            if (!category) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });

            await category.destroy();
            res.json({ success: true, message: 'Đã xóa danh mục' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ConcessionCategoryController();
