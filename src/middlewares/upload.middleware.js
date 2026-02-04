/**
 * Upload Middleware
 * Cấu hình multer để xử lý file upload
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadDirs = ['uploads', 'uploads/images', 'uploads/videos', 'uploads/posters'];
uploadDirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Cấu hình storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Phân loại thư mục theo loại file
        if (file.fieldname === 'poster' || file.mimetype.startsWith('image/')) {
            uploadPath = 'uploads/posters/';
        } else if (file.fieldname === 'video' || file.mimetype.startsWith('video/')) {
            uploadPath = 'uploads/videos/';
        } else {
            uploadPath = 'uploads/images/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        // Sanitize filename
        const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        cb(null, `${uniqueSuffix}-${safeName}${ext}`);
    },
});

// Filter file types
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false);
    }
};

const videoFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/mkv',
        'video/x-matroska',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed (mp4, webm, ogg, avi, mkv)'), false);
    }
};

const allMediaFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/mkv',
        'video/x-matroska',
    ];

    if ([...allowedImageTypes, ...allowedVideoTypes].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'), false);
    }
};

// Upload configurations
const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max cho ảnh
    },
});

const uploadVideo = multer({
    storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB max cho video
    },
});

const uploadMedia = multer({
    storage,
    fileFilter: allMediaFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB max
    },
});

// Upload poster (giống uploadImage nhưng lưu vào folder posters)
const posterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/posters/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        cb(null, `${uniqueSuffix}-${safeName}${ext}`);
    },
});

const uploadPoster = multer({
    storage: posterStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max cho poster
    },
});

// Error handler middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

module.exports = {
    uploadImage,
    uploadVideo,
    uploadMedia,
    uploadPoster,
    handleUploadError,
};
