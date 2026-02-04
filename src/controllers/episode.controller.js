const { Episode, Movie } = require('../../models');

class EpisodeController {
    // Lấy danh sách tập phim theo movie
    async getEpisodesByMovie(req, res) {
        try {
            const { movieId } = req.params;

            const episodes = await Episode.findAll({
                where: { movieId },
                order: [['episodeNumber', 'ASC']],
            });

            res.json({ success: true, data: episodes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết tập phim
    async getEpisodeById(req, res) {
        try {
            const episode = await Episode.findByPk(req.params.id, {
                include: [{ model: Movie, as: 'movie' }],
            });

            if (!episode) {
                return res.status(404).json({ success: false, message: 'Episode not found' });
            }

            res.json({ success: true, data: episode });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo tập phim mới (Admin)
    async createEpisode(req, res) {
        try {
            const { movieId, episodeNumber, title, videoUrl, duration } = req.body;

            // Kiểm tra movie có tồn tại
            const movie = await Movie.findByPk(movieId);
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            const episode = await Episode.create({
                movieId,
                episodeNumber,
                title,
                videoUrl,
                duration,
            });

            res.status(201).json({ success: true, data: episode });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật tập phim (Admin)
    async updateEpisode(req, res) {
        try {
            const episode = await Episode.findByPk(req.params.id);

            if (!episode) {
                return res.status(404).json({ success: false, message: 'Episode not found' });
            }

            const { episodeNumber, title, videoUrl, duration } = req.body;

            await episode.update({ episodeNumber, title, videoUrl, duration });

            res.json({ success: true, data: episode });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa tập phim (Admin)
    async deleteEpisode(req, res) {
        try {
            const episode = await Episode.findByPk(req.params.id);

            if (!episode) {
                return res.status(404).json({ success: false, message: 'Episode not found' });
            }

            await episode.destroy();
            res.json({ success: true, message: 'Episode deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EpisodeController();
