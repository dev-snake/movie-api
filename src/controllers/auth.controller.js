const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    // Đăng ký tài khoản
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Kiểm tra email đã tồn tại
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered',
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Tạo user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            // Tạo token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Đăng nhập
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Kiểm tra user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }

            // Kiểm tra password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }

            // Tạo token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AuthController();
