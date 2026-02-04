/**
 * Upload Controller
 * Xử lý upload files
 */

const path = require('path');
const fs = require('fs');
const { Movie, Episode, User } = require('../../models');

class UploadController {
    /**
     * Upload single image (poster, avatar, etc.)
     * POST /api/upload/image
     */
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            res.status(201).json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    path: req.file.path.replace(/\\/g, '/'),
                    url: fileUrl,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Upload multiple images
     * POST /api/upload/images
     */
    async uploadImages(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No files uploaded',
                });
            }

            const filesData = req.files.map((file) => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path.replace(/\\/g, '/'),
                url: `${req.protocol}://${req.get('host')}/${file.path.replace(/\\/g, '/')}`,
            }));

            res.status(201).json({
                success: true,
                message: `${req.files.length} images uploaded successfully`,
                data: filesData,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Upload video
     * POST /api/upload/video
     */
    async uploadVideo(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No video uploaded',
                });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            res.status(201).json({
                success: true,
                message: 'Video uploaded successfully',
                data: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    path: req.file.path.replace(/\\/g, '/'),
                    url: fileUrl,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Upload poster for movie
     * POST /api/upload/poster
     */
    async uploadPoster(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No poster uploaded',
                });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            res.status(201).json({
                success: true,
                message: 'Poster uploaded successfully',
                data: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    path: req.file.path.replace(/\\/g, '/'),
                    url: fileUrl,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Delete uploaded file
     * DELETE /api/upload/:filename
     */
    async deleteFile(req, res) {
        try {
            const { filename } = req.params;
            const { folder = 'images' } = req.query;

            // Validate folder
            const allowedFolders = ['images', 'videos', 'posters'];
            if (!allowedFolders.includes(folder)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid folder',
                });
            }

            const filePath = path.join(process.cwd(), 'uploads', folder, filename);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found',
                });
            }

            // Delete file
            fs.unlinkSync(filePath);

            res.json({
                success: true,
                message: 'File deleted successfully',
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Upload poster và cập nhật vào Movie
     * POST /api/upload/movie/:movieId/poster
     */
    async uploadMoviePoster(req, res) {
        try {
            const { movieId } = req.params;

            // Kiểm tra movie tồn tại
            const movie = await Movie.findByPk(movieId);
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No poster uploaded' });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            // Xóa poster cũ nếu có và là file local
            if (movie.posterUrl && movie.posterUrl.includes('/uploads/')) {
                const oldPath = movie.posterUrl.split('/uploads/')[1];
                const oldFilePath = path.join(process.cwd(), 'uploads', oldPath);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Cập nhật movie với poster mới
            await movie.update({ posterUrl: fileUrl });

            res.status(201).json({
                success: true,
                message: 'Movie poster uploaded and updated successfully',
                data: {
                    movieId: movie.id,
                    posterUrl: fileUrl,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Upload video và cập nhật vào Episode
     * POST /api/upload/episode/:episodeId/video
     */
    async uploadEpisodeVideo(req, res) {
        try {
            const { episodeId } = req.params;

            // Kiểm tra episode tồn tại
            const episode = await Episode.findByPk(episodeId);
            if (!episode) {
                return res.status(404).json({ success: false, message: 'Episode not found' });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No video uploaded' });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            // Xóa video cũ nếu có và là file local
            if (episode.videoUrl && episode.videoUrl.includes('/uploads/')) {
                const oldPath = episode.videoUrl.split('/uploads/')[1];
                const oldFilePath = path.join(process.cwd(), 'uploads', oldPath);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Cập nhật episode với video mới
            await episode.update({ videoUrl: fileUrl });

            res.status(201).json({
                success: true,
                message: 'Episode video uploaded and updated successfully',
                data: {
                    episodeId: episode.id,
                    videoUrl: fileUrl,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Upload avatar cho user
     * POST /api/upload/avatar
     */
    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No avatar uploaded' });
            }

            const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

            // Lấy user hiện tại
            const user = await User.findByPk(req.user.id);

            // Xóa avatar cũ nếu có và là file local
            if (user.avatar && user.avatar.includes('/uploads/')) {
                const oldPath = user.avatar.split('/uploads/')[1];
                const oldFilePath = path.join(process.cwd(), 'uploads', oldPath);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Cập nhật user với avatar mới
            await user.update({ avatar: fileUrl });

            res.status(201).json({
                success: true,
                message: 'Avatar uploaded successfully',
                data: {
                    avatar: fileUrl,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new UploadController();
