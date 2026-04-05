const { Genre } = require('../../models');

class GenreController {
    // Lấy danh sách thể loại
    async getAllGenres(req, res) {
        try {
            const genres = await Genre.findAll({
                order: [['sortOrder', 'ASC'], ['name', 'ASC']],
            });

            res.json({ success: true, data: genres });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết thể loại
    async getGenreById(req, res) {
        try {
            const genre = await Genre.findByPk(req.params.id);

            if (!genre) {
                return res.status(404).json({ success: false, message: 'Genre not found' });
            }

            res.json({ success: true, data: genre });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo thể loại mới (Admin)
    async createGenre(req, res) {
        try {
            const { name, description, color, sortOrder } = req.body;

            const genre = await Genre.create({ name, description, color, sortOrder });

            res.status(201).json({ success: true, data: genre });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật thể loại (Admin)
    async updateGenre(req, res) {
        try {
            const genre = await Genre.findByPk(req.params.id);

            if (!genre) {
                return res.status(404).json({ success: false, message: 'Genre not found' });
            }

            const { name, description, color, sortOrder } = req.body;
            await genre.update({ name, description, color, sortOrder });

            res.json({ success: true, data: genre });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa thể loại (Admin)
    async deleteGenre(req, res) {
        try {
            const genre = await Genre.findByPk(req.params.id);

            if (!genre) {
                return res.status(404).json({ success: false, message: 'Genre not found' });
            }

            await genre.destroy();
            res.json({ success: true, message: 'Genre deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new GenreController();
