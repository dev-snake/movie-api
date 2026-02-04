const { Favorite, Movie, Genre } = require('../../models');

class FavoriteController {
    // Lấy danh sách phim yêu thích
    async getFavorites(req, res) {
        try {
            const favorites = await Favorite.findAll({
                where: { userId: req.user.id },
                include: [
                    {
                        model: Movie,
                        as: 'movie',
                        include: [{ model: Genre, as: 'genres', through: { attributes: [] } }],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json({ success: true, data: favorites });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Thêm phim vào yêu thích
    async addFavorite(req, res) {
        try {
            const { movieId } = req.params;

            // Kiểm tra movie có tồn tại
            const movie = await Movie.findByPk(movieId);
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            // Kiểm tra đã yêu thích chưa
            const existingFavorite = await Favorite.findOne({
                where: { userId: req.user.id, movieId },
            });

            if (existingFavorite) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Movie already in favorites' });
            }

            const favorite = await Favorite.create({
                userId: req.user.id,
                movieId,
            });

            res.status(201).json({ success: true, data: favorite });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa phim khỏi yêu thích
    async removeFavorite(req, res) {
        try {
            const { movieId } = req.params;

            const favorite = await Favorite.findOne({
                where: { userId: req.user.id, movieId },
            });

            if (!favorite) {
                return res.status(404).json({ success: false, message: 'Favorite not found' });
            }

            await favorite.destroy();
            res.json({ success: true, message: 'Removed from favorites' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Kiểm tra phim có trong yêu thích không
    async checkFavorite(req, res) {
        try {
            const { movieId } = req.params;

            const favorite = await Favorite.findOne({
                where: { userId: req.user.id, movieId },
            });

            res.json({ success: true, data: { isFavorite: !!favorite } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new FavoriteController();
