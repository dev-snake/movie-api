const { User, Booking } = require('../../models');
const bcrypt = require('bcryptjs');
const { Pagination, ApiFeatures } = require('../utils');

class UserController {
    // Lấy thông tin cá nhân
    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] },
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật thông tin cá nhân
    async updateProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const { name, email, password } = req.body;

            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }

            await user.update(updateData);

            const updatedUser = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] },
            });

            res.json({ success: true, data: updatedUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy danh sách users (Admin)
    async getAllUsers(req, res) {
        try {
            const { queryOptions, pagination } = ApiFeatures.buildListQuery(req.query, {
                searchFields: ['name', 'email'],
                filterFields: { role: 'eq' },
                defaultSort: 'createdAt',
                defaultOrder: 'DESC',
            });

            queryOptions.attributes = { exclude: ['password'] };

            const result = await User.findAndCountAll(queryOptions);

            ApiFeatures.sendPaginatedResponse(res, result, pagination);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Lấy user theo ID (Admin)
    async getUserById(req, res) {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] },
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật user (Admin)
    async updateUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const { name, email, role } = req.body;

            await user.update({ name, email, role });

            const updatedUser = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] },
            });

            res.json({ success: true, data: updatedUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa user (Admin)
    async deleteUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Không cho xóa chính mình
            if (user.id === req.user.id) {
                return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản đang đăng nhập' });
            }

            // Kiểm tra ràng buộc FK: user còn booking thì không cho xóa
            const bookingCount = await Booking.count({ where: { userId: user.id } });
            if (bookingCount > 0) {
                return res.status(409).json({
                    success: false,
                    message: `Không thể xóa: người dùng này có ${bookingCount} lịch đặt vé. Hãy hủy hoặc xóa các đặt vé trước.`,
                });
            }

            await user.destroy();
            res.json({ success: true, message: 'Đã xóa người dùng thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo user mới (Admin)
    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
            }

            const existing = await User.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'user',
            });

            const createdUser = await User.findByPk(user.id, {
                attributes: { exclude: ['password'] },
            });

            res.status(201).json({ success: true, data: createdUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UserController();
