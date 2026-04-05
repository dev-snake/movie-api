const express = require('express');
const router = express.Router();

const movieRoutes = require('./movie.routes');
const genreRoutes = require('./genre.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const episodeRoutes = require('./episode.routes');
const favoriteRoutes = require('./favorite.routes');
const commentRoutes = require('./comment.routes');
const uploadRoutes = require('./upload.routes');
const theaterRoutes = require('./theater.routes');
const screenRoutes = require('./screen.routes');
const showtimeRoutes = require('./showtime.routes');
const bookingRoutes = require('./booking.routes');
const adminRoutes = require('./admin.routes');
const concessionRoutes = require('./concession.routes');
const concessionCategoryRoutes = require('./concession_category.routes');

// API Info
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Movie API v1.0',
        endpoints: {
            auth: '/api/auth',
            movies: '/api/movies',
            genres: '/api/genres',
            episodes: '/api/episodes',
            favorites: '/api/favorites',
            comments: '/api/comments',
            users: '/api/users',
            upload: '/api/upload',
            theaters: '/api/theaters',
            screens: '/api/screens',
            showtimes: '/api/showtimes',
            bookings: '/api/bookings',
            admin: '/api/admin',
            concessions: '/api/concessions',
        },
        documentation: '/api-docs',
    });
});

// Routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/genres', genreRoutes);
router.use('/episodes', episodeRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/theaters', theaterRoutes);
router.use('/screens', screenRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/concessions', concessionRoutes);
router.use('/concession-categories', concessionCategoryRoutes);

module.exports = router;
