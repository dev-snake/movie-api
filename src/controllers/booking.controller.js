const { Booking, BookingSeat, Showtime, Seat, Movie, Screen, Theater, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const { ApiFeatures } = require('../utils');

class BookingController {
    // Đặt vé (User) - sử dụng transaction
    async createBooking(req, res) {
        const t = await sequelize.transaction();

        try {
            const { showtimeId, seatIds, paymentMethod } = req.body;
            const userId = req.user.id;

            // Validate input
            if (!seatIds || seatIds.length === 0) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Please select at least one seat' });
            }

            // Kiểm tra showtime có tồn tại và còn active
            const showtime = await Showtime.findOne({
                where: { id: showtimeId, status: 'active' },
                include: [{ model: Screen, as: 'screen' }],
                transaction: t,
            });

            if (!showtime) {
                await t.rollback();
                return res.status(404).json({ success: false, message: 'Showtime not found or cancelled' });
            }

            // Kiểm tra lịch chiếu chưa bắt đầu
            if (new Date(showtime.startTime) <= new Date()) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Showtime has already started' });
            }

            // Kiểm tra ghế có thuộc phòng chiếu của showtime không
            const seats = await Seat.findAll({
                where: {
                    id: { [Op.in]: seatIds },
                    screenId: showtime.screenId,
                },
                transaction: t,
            });

            if (seats.length !== seatIds.length) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Some seats are invalid' });
            }

            // Lock và kiểm tra ghế đã được đặt chưa (dùng FOR UPDATE)
            const bookedSeats = await BookingSeat.findAll({
                where: { seatId: { [Op.in]: seatIds } },
                include: [
                    {
                        model: Booking,
                        as: 'booking',
                        where: {
                            showtimeId,
                            status: { [Op.in]: ['pending', 'confirmed'] },
                        },
                    },
                ],
                transaction: t,
                lock: t.LOCK.UPDATE, // Lock để tránh race condition
            });

            if (bookedSeats.length > 0) {
                await t.rollback();
                const bookedSeatIds = bookedSeats.map((bs) => bs.seatId);
                return res.status(400).json({
                    success: false,
                    message: 'Some seats are already booked',
                    bookedSeatIds,
                });
            }

            // Tính tổng tiền
            const basePrice = parseFloat(showtime.price);
            let totalAmount = 0;
            const bookingSeatData = seats.map((seat) => {
                const seatPrice = seat.type === 'vip' ? basePrice * 1.5 : basePrice;
                totalAmount += seatPrice;
                return { seatId: seat.id, price: seatPrice };
            });

            // Tạo booking
            const booking = await Booking.create(
                {
                    userId,
                    showtimeId,
                    totalAmount,
                    status: 'confirmed', // Xác nhận ngay (không có payment gateway)
                    paymentMethod: paymentMethod || null,
                },
                { transaction: t },
            );

            // Tạo booking seats
            const bookingSeatsToCreate = bookingSeatData.map((data) => ({
                bookingId: booking.id,
                seatId: data.seatId,
                price: data.price,
            }));

            await BookingSeat.bulkCreate(bookingSeatsToCreate, { transaction: t });

            // Commit transaction
            await t.commit();

            // Lấy chi tiết booking
            const bookingDetails = await Booking.findByPk(booking.id, {
                include: [
                    {
                        model: Showtime,
                        as: 'showtime',
                        include: [
                            { model: Movie, as: 'movie' },
                            {
                                model: Screen,
                                as: 'screen',
                                include: [{ model: Theater, as: 'theater' }],
                            },
                        ],
                    },
                    {
                        model: BookingSeat,
                        as: 'bookingSeats',
                        include: [{ model: Seat, as: 'seat' }],
                    },
                ],
            });

            res.status(201).json({ success: true, data: bookingDetails });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy lịch sử đặt vé của user
    async getMyBookings(req, res) {
        try {
            const userId = req.user.id;

            const { queryOptions, pagination } = ApiFeatures.buildListQuery(req.query, {
                defaultSort: 'createdAt',
                defaultOrder: 'DESC',
            });

            queryOptions.where = { ...queryOptions.where, userId };
            queryOptions.include = [
                {
                    model: Showtime,
                    as: 'showtime',
                    include: [
                        { model: Movie, as: 'movie', attributes: ['id', 'title', 'posterUrl'] },
                        {
                            model: Screen,
                            as: 'screen',
                            include: [{ model: Theater, as: 'theater', attributes: ['id', 'name'] }],
                        },
                    ],
                },
                {
                    model: BookingSeat,
                    as: 'bookingSeats',
                    include: [{ model: Seat, as: 'seat' }],
                },
            ];

            const result = await Booking.findAndCountAll(queryOptions);

            ApiFeatures.sendPaginatedResponse(res, result, pagination);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy chi tiết booking
    async getBookingById(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.id, {
                include: [
                    {
                        model: Showtime,
                        as: 'showtime',
                        include: [
                            { model: Movie, as: 'movie' },
                            {
                                model: Screen,
                                as: 'screen',
                                include: [{ model: Theater, as: 'theater' }],
                            },
                        ],
                    },
                    {
                        model: BookingSeat,
                        as: 'bookingSeats',
                        include: [{ model: Seat, as: 'seat' }],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Chỉ cho phép xem booking của mình hoặc admin
            if (booking.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            res.json({ success: true, data: booking });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Hủy booking (trước giờ chiếu)
    async cancelBooking(req, res) {
        try {
            const booking = await Booking.findByPk(req.params.id, {
                include: [{ model: Showtime, as: 'showtime' }],
            });

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            // Chỉ cho phép hủy booking của mình hoặc admin
            if (booking.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            // Không cho hủy nếu đã hủy
            if (booking.status === 'cancelled') {
                return res.status(400).json({ success: false, message: 'Booking already cancelled' });
            }

            // Không cho hủy nếu đã chiếu
            if (new Date(booking.showtime.startTime) <= new Date()) {
                return res.status(400).json({ success: false, message: 'Cannot cancel after showtime started' });
            }

            await booking.update({ status: 'cancelled' });

            res.json({ success: true, message: 'Booking cancelled successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy tất cả bookings (Admin)
    async getAllBookings(req, res) {
        try {
            const { queryOptions, pagination } = ApiFeatures.buildListQuery(req.query, {
                filterFields: { status: 'eq' },
                defaultSort: 'createdAt',
                defaultOrder: 'DESC',
            });

            queryOptions.include = [
                {
                    model: Showtime,
                    as: 'showtime',
                    include: [
                        { model: Movie, as: 'movie', attributes: ['id', 'title'] },
                        {
                            model: Screen,
                            as: 'screen',
                            include: [{ model: Theater, as: 'theater', attributes: ['id', 'name'] }],
                        },
                    ],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: BookingSeat,
                    as: 'bookingSeats',
                },
            ];

            const result = await Booking.findAndCountAll(queryOptions);

            ApiFeatures.sendPaginatedResponse(res, result, pagination);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new BookingController();
