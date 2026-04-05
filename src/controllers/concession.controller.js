const { Concession } = require('../../models');

class ConcessionController {
    async getAll(req, res) {
        try {
            const where = { isActive: true };
            if (req.query.category) {
                where.category = req.query.category;
            }
            const concessions = await Concession.findAll({
                where,
                order: [['category', 'ASC'], ['name', 'ASC']],
            });
            res.json({ success: true, data: concessions });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const concession = await Concession.findByPk(req.params.id);
            if (!concession) {
                return res.status(404).json({ success: false, message: 'Concession not found' });
            }
            res.json({ success: true, data: concession });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { name, description, price, image, category } = req.body;
            const concession = await Concession.create({ name, description, price, image, category });
            res.status(201).json({ success: true, data: concession });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const concession = await Concession.findByPk(req.params.id);
            if (!concession) {
                return res.status(404).json({ success: false, message: 'Concession not found' });
            }
            const { name, description, price, image, category, isActive } = req.body;
            await concession.update({ name, description, price, image, category, isActive });
            res.json({ success: true, data: concession });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const concession = await Concession.findByPk(req.params.id);
            if (!concession) {
                return res.status(404).json({ success: false, message: 'Concession not found' });
            }
            await concession.destroy();
            res.json({ success: true, message: 'Concession deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ConcessionController();
