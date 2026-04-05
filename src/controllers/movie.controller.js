const { Movie, Genre, Episode } = require('../../models');
const { Pagination, QueryBuilder, ApiFeatures } = require('../utils');

class MovieController {
    // Lấy danh sách phim với phân trang và filter
    async getAllMovies(req, res) {
        try {
            const { genre } = req.query;

            // Sử dụng ApiFeatures để build query
            const { queryOptions, pagination, builder } = ApiFeatures.buildListQuery(req.query, {
                searchFields: ['title', 'description'],
                filterFields: {
                    status: 'eq',
                    type: 'eq',
                    releaseYear: 'eq',
                },
                defaultSort: 'createdAt',
                defaultOrder: 'DESC',
                allowedSortFields: {
                    title: 'title',
                    year: 'releaseYear',
                    views: 'views',
                    rating: 'rating',
                    createdAt: 'createdAt',
                },
            });

            // 'all' → admin bypass; no status → default 'published' for public
            if (req.query.status === 'all') {
                delete queryOptions.where.status;
            } else if (!req.query.status) {
                queryOptions.where.status = 'published';
            }

            // Include genres
            const include = [{ model: Genre, as: 'genres', through: { attributes: [] } }];

            // Filter theo thể loại
            if (genre) {
                include[0].where = { id: genre };
            }

            queryOptions.include = include;
            queryOptions.distinct = true;

            const result = await Movie.findAndCountAll(queryOptions);

            ApiFeatures.sendPaginatedResponse(res, result, pagination);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết phim theo ID
    async getMovieById(req, res) {
        try {
            const movie = await Movie.findByPk(req.params.id, {
                include: [
                    { model: Genre, as: 'genres', through: { attributes: [] } },
                    { model: Episode, as: 'episodes' },
                ],
                order: [[{ model: Episode, as: 'episodes' }, 'episodeNumber', 'ASC']],
            });

            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            // Tăng lượt xem
            await movie.increment('views');

            res.json({ success: true, data: movie });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo phim mới (Admin)
    async createMovie(req, res) {
        try {
            const {
                title,
                description,
                releaseYear,
                duration,
                posterUrl,
                trailerUrl,
                type,
                status,
                genreIds,
            } = req.body;

            const movie = await Movie.create({
                title,
                description,
                releaseYear,
                duration,
                posterUrl,
                trailerUrl,
                type: type || 'single',
                status: status || 'draft',
            });

            if (genreIds && genreIds.length > 0) {
                await movie.setGenres(genreIds);
            }

            const movieWithGenres = await Movie.findByPk(movie.id, {
                include: [{ model: Genre, as: 'genres', through: { attributes: [] } }],
            });

            res.status(201).json({ success: true, data: movieWithGenres });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật phim (Admin)
    async updateMovie(req, res) {
        try {
            const movie = await Movie.findByPk(req.params.id);

            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            const {
                title,
                description,
                releaseYear,
                duration,
                posterUrl,
                trailerUrl,
                type,
                status,
                genreIds,
            } = req.body;

            await movie.update({
                title,
                description,
                releaseYear,
                duration,
                posterUrl,
                trailerUrl,
                type,
                status,
            });

            if (genreIds) {
                await movie.setGenres(genreIds);
            }

            const updatedMovie = await Movie.findByPk(movie.id, {
                include: [{ model: Genre, as: 'genres', through: { attributes: [] } }],
            });

            res.json({ success: true, data: updatedMovie });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa phim (Admin)
    async deleteMovie(req, res) {
        try {
            const movie = await Movie.findByPk(req.params.id);

            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            await movie.destroy();
            res.json({ success: true, message: 'Movie deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new MovieController();
