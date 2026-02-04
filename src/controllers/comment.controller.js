const { Comment, User, Movie } = require('../../models');
const { Pagination, ApiFeatures } = require('../utils');

class CommentController {
    // Lấy danh sách bình luận theo phim
    async getCommentsByMovie(req, res) {
        try {
            const { movieId } = req.params;

            const pagination = Pagination.parse(req.query);

            const { count, rows: comments } = await Comment.findAndCountAll({
                where: { movieId },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar'],
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit: pagination.limit,
                offset: pagination.offset,
            });

            Pagination.sendResponse(res, comments, count, pagination.page, pagination.limit);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Tạo bình luận mới
    async createComment(req, res) {
        try {
            const { movieId, content } = req.body;

            // Kiểm tra movie có tồn tại
            const movie = await Movie.findByPk(movieId);
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found' });
            }

            const comment = await Comment.create({
                userId: req.user.id,
                movieId,
                content,
            });

            const commentWithUser = await Comment.findByPk(comment.id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar'],
                    },
                ],
            });

            res.status(201).json({ success: true, data: commentWithUser });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cập nhật bình luận (chỉ chủ comment)
    async updateComment(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id);

            if (!comment) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }

            // Chỉ chủ comment mới được sửa
            if (comment.userId !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            const { content } = req.body;
            await comment.update({ content });

            const updatedComment = await Comment.findByPk(comment.id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar'],
                    },
                ],
            });

            res.json({ success: true, data: updatedComment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Xóa bình luận (chủ comment hoặc admin)
    async deleteComment(req, res) {
        try {
            const comment = await Comment.findByPk(req.params.id);

            if (!comment) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }

            // Chỉ chủ comment hoặc admin mới được xóa
            if (comment.userId !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            await comment.destroy();
            res.json({ success: true, message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new CommentController();
