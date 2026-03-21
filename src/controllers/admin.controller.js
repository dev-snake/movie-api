const { Booking, Showtime, Movie, Theater, Screen, sequelize } = require('../../models');
const { Op } = require('sequelize');

class AdminController {
    // Thống kê doanh thu đơn giản
    async getStats(req, res) {
        try {
            const { startDate, endDate } = req.query;

            // Default: 30 ngày gần nhất
            const end = endDate ? new Date(endDate) : new Date();
            const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Tổng doanh thu
            const totalRevenue = await Booking.sum('totalAmount', {
                where: {
                    status: 'confirmed',
                    createdAt: { [Op.between]: [start, end] },
                },
            });

            // Tổng số booking
            const totalBookings = await Booking.count({
                where: {
                    status: 'confirmed',
                    createdAt: { [Op.between]: [start, end] },
                },
            });

            // Doanh thu theo phim (top 5)
            const revenueByMovie = await Booking.findAll({
                attributes: [[sequelize.fn('SUM', sequelize.col('Booking.totalAmount')), 'revenue']],
                where: {
                    status: 'confirmed',
                    createdAt: { [Op.between]: [start, end] },
                },
                include: [
                    {
                        model: Showtime,
                        as: 'showtime',
                        attributes: [],
                        include: [
                            {
                                model: Movie,
                                as: 'movie',
                                attributes: ['id', 'title'],
                            },
                        ],
                    },
                ],
                group: ['showtime.movie.id'],
                order: [[sequelize.literal('revenue'), 'DESC']],
                limit: 5,
                raw: true,
                nest: true,
            });

            // Doanh thu theo rạp
            const revenueByTheater = await Booking.findAll({
                attributes: [[sequelize.fn('SUM', sequelize.col('Booking.totalAmount')), 'revenue']],
                where: {
                    status: 'confirmed',
                    createdAt: { [Op.between]: [start, end] },
                },
                include: [
                    {
                        model: Showtime,
                        as: 'showtime',
                        attributes: [],
                        include: [
                            {
                                model: Screen,
                                as: 'screen',
                                attributes: [],
                                include: [
                                    {
                                        model: Theater,
                                        as: 'theater',
                                        attributes: ['id', 'name'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                group: ['showtime.screen.theater.id'],
                order: [[sequelize.literal('revenue'), 'DESC']],
                raw: true,
                nest: true,
            });

            // Doanh thu theo ngày (7 ngày gần nhất)
            const last7Days = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
            const revenueByDay = await Booking.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('Booking.createdAt')), 'date'],
                    [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
                    [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookings'],
                ],
                where: {
                    status: 'confirmed',
                    createdAt: { [Op.between]: [last7Days, end] },
                },
                group: [sequelize.fn('DATE', sequelize.col('Booking.createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('Booking.createdAt')), 'ASC']],
                raw: true,
            });

            res.json({
                success: true,
                data: {
                    period: { startDate: start, endDate: end },
                    summary: {
                        totalRevenue: totalRevenue || 0,
                        totalBookings: totalBookings || 0,
                    },
                    revenueByMovie,
                    revenueByTheater,
                    revenueByDay,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AdminController();
