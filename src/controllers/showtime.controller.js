const { Showtime, Movie, Screen, Theater, Seat, Booking, BookingSeat } = require('../../models');
const { Op } = require('sequelize');
const { ApiFeatures } = require('../utils');

class ShowtimeController {
    // Lấy danh sách lịch chiếu (filter theo movie, theater, date)
    async getAllShowtimes(req, res) {
        try {
            const { movieId, theaterId, date } = req.query;

            const where = { status: 'active' };

            if (movieId) {
                where.movieId = movieId;
            }

            // Filter theo ngày
            if (date) {
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                where.startTime = {
                    [Op.between]: [startOfDay, endOfDay],
                };
            }

            // Lấy lịch chiếu
            const include = [
                {
                    model: Movie,
                    as: 'movie',
                    attributes: ['id', 'title', 'posterUrl', 'duration'],
                },
                {
                    model: Screen,
                    as: 'screen',
                    include: [
                        {
                            model: Theater,
                            as: 'theater',
                            attributes: ['id', 'name', 'address'],
                        },
                    ],
                },
            ];

            // Filter theo theater thông qua screen
            if (theaterId) {
                include[1].where = { theaterId };
            }

            const showtimes = await Showtime.findAll({
                where,
                include,
                order: [['startTime', 'ASC']],
            });

            res.json({ success: true, data: showtimes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết lịch chiếu + ghế còn trống
    async getShowtimeById(req, res) {
        try {
            const showtime = await Showtime.findByPk(req.params.id, {
                include: [
                    {
                        model: Movie,
                        as: 'movie',
                    },
                    {
                        model: Screen,
                        as: 'screen',
                        include: [
                            { model: Theater, as: 'theater' },
                            { model: Seat, as: 'seats' },
                        ],
                    },
                ],
            });

            if (!showtime) {
                return res.status(404).json({ success: false, message: 'Showtime not found' });
            }

            // Lấy danh sách ghế đã đặt
            const bookedSeats = await BookingSeat.findAll({
                include: [
                    {
                        model: Booking,
                        as: 'booking',
                        where: {
                            showtimeId: showtime.id,
                            status: { [Op.in]: ['pending', 'confirmed'] },
                        },
                    },
                ],
                attributes: ['seatId'],
            });

            const bookedSeatIds = bookedSeats.map((bs) => bs.seatId);

            // Đánh dấu ghế đã đặt
            const seatsWithStatus = showtime.screen.seats.map((seat) => ({
                ...seat.toJSON(),
                isBooked: bookedSeatIds.includes(seat.id),
            }));

            res.json({
                success: true,
                data: {
                    ...showtime.toJSON(),
                    screen: {
                        ...showtime.screen.toJSON(),
                        seats: seatsWithStatus,
                    },
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo lịch chiếu mới (Admin)
    async createShowtime(req, res) {
        try {
            const { movieId, screenId, startTime, price } = req.body;

            // Kiểm tra movie có tồn tại
            const movie = await Movie.findByPk(movieId);
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            // Kiểm tra screen có tồn tại
            const screen = await Screen.findByPk(screenId);
            if (!screen) {
                return res.status(404).json({ success: false, message: 'Screen not found' });
            }

            // Tính endTime dựa trên duration của movie (thêm 15 phút nghỉ)
            const start = new Date(startTime);
            const end = new Date(start.getTime() + (movie.duration + 15) * 60 * 1000);

            // Kiểm tra trùng lịch chiếu trong cùng phòng
            const conflictShowtime = await Showtime.findOne({
                where: {
                    screenId,
                    status: 'active',
                    [Op.or]: [
                        {
                            startTime: {
                                [Op.between]: [start, end],
                            },
                        },
                        {
                            endTime: {
                                [Op.between]: [start, end],
                            },
                        },
                        {
                            [Op.and]: [
                                { startTime: { [Op.lte]: start } },
                                { endTime: { [Op.gte]: end } },
                            ],
                        },
                    ],
                },
            });

            if (conflictShowtime) {
                return res.status(400).json({
                    success: false,
                    message: 'Showtime conflicts with existing schedule',
                });
            }

            const showtime = await Showtime.create({
                movieId,
                screenId,
                startTime: start,
                endTime: end,
                price,
            });

            const showtimeWithDetails = await Showtime.findByPk(showtime.id, {
                include: [
                    { model: Movie, as: 'movie' },
                    {
                        model: Screen,
                        as: 'screen',
                        include: [{ model: Theater, as: 'theater' }],
                    },
                ],
            });

            res.status(201).json({ success: true, data: showtimeWithDetails });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật lịch chiếu (Admin)
    async updateShowtime(req, res) {
        try {
            const showtime = await Showtime.findByPk(req.params.id);

            if (!showtime) {
                return res.status(404).json({ success: false, message: 'Showtime not found' });
            }

            const { startTime, price, status } = req.body;

            // Nếu cập nhật startTime, tính lại endTime
            if (startTime) {
                const movie = await Movie.findByPk(showtime.movieId);
                const start = new Date(startTime);
                const end = new Date(start.getTime() + (movie.duration + 15) * 60 * 1000);

                // Kiểm tra trùng lịch (trừ chính nó)
                const conflictShowtime = await Showtime.findOne({
                    where: {
                        screenId: showtime.screenId,
                        status: 'active',
                        id: { [Op.ne]: showtime.id },
                        [Op.or]: [
                            { startTime: { [Op.between]: [start, end] } },
                            { endTime: { [Op.between]: [start, end] } },
                        ],
                    },
                });

                if (conflictShowtime) {
                    return res.status(400).json({
                        success: false,
                        message: 'Showtime conflicts with existing schedule',
                    });
                }

                await showtime.update({ startTime: start, endTime: end, price, status });
            } else {
                await showtime.update({ price, status });
            }

            res.json({ success: true, data: showtime });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa/Hủy lịch chiếu (Admin)
    async deleteShowtime(req, res) {
        try {
            const showtime = await Showtime.findByPk(req.params.id);

            if (!showtime) {
                return res.status(404).json({ success: false, message: 'Showtime not found' });
            }

            // Soft delete - chuyển status thành cancelled
            await showtime.update({ status: 'cancelled' });

            res.json({ success: true, message: 'Showtime cancelled successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ShowtimeController();
