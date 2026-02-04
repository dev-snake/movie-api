const jwt = require('jsonwebtoken');
const { User } = require('../../models');

// Middleware xác thực JWT
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Middleware phân quyền - chỉ Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.',
        });
    }
};

// Middleware phân quyền - Admin hoặc chính chủ
exports.isAdminOrOwner = (paramName = 'userId') => {
    return (req, res, next) => {
        const resourceUserId = parseInt(req.params[paramName]);
        if (req.user && (req.user.role === 'admin' || req.user.id === resourceUserId)) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Access denied.',
            });
        }
    };
};

// Middleware optional auth - không bắt buộc đăng nhập
exports.optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] },
            });
            req.user = user || null;
        } else {
            req.user = null;
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};
