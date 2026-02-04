/**
 * Upload Routes
 * Các routes liên quan đến upload file
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const {
    uploadImage,
    uploadVideo,
    uploadPoster,
    handleUploadError,
} = require('../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload files (images, videos, posters)
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload single image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, png, gif, webp) - max 5MB
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalName:
 *                       type: string
 *                     url:
 *                       type: string
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/image',
    authenticate,
    uploadImage.single('image'),
    handleUploadError,
    uploadController.uploadImage,
);

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     summary: Upload multiple images (max 10)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       400:
 *         description: No files uploaded
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/images',
    authenticate,
    uploadImage.array('images', 10),
    handleUploadError,
    uploadController.uploadImages,
);

/**
 * @swagger
 * /api/upload/poster:
 *   post:
 *     summary: Upload movie poster (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Poster image (jpeg, png, gif, webp) - max 5MB
 *     responses:
 *       201:
 *         description: Poster uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
    '/poster',
    authenticate,
    isAdmin,
    uploadImage.single('poster'),
    handleUploadError,
    uploadController.uploadPoster,
);

/**
 * @swagger
 * /api/upload/video:
 *   post:
 *     summary: Upload video (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (mp4, webm, ogg, avi, mkv) - max 500MB
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
    '/video',
    authenticate,
    isAdmin,
    uploadVideo.single('video'),
    handleUploadError,
    uploadController.uploadVideo,
);

/**
 * @swagger
 * /api/upload/{filename}:
 *   delete:
 *     summary: Delete uploaded file (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Filename to delete
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *           enum: [images, videos, posters]
 *           default: images
 *         description: Folder where file is located
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.delete('/:filename', authenticate, isAdmin, uploadController.deleteFile);

/**
 * @swagger
 * /api/upload/movie/{movieId}/poster:
 *   post:
 *     summary: Upload and update movie poster (Admin only)
 *     description: Upload a poster image and automatically update the movie's posterUrl
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID to update poster
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - poster
 *             properties:
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Poster image file (jpeg, png, gif, webp - max 5MB)
 *     responses:
 *       200:
 *         description: Poster uploaded and movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Movie poster updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     posterUrl:
 *                       type: string
 *                     movie:
 *                       type: object
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
    '/movie/:movieId/poster',
    authenticate,
    isAdmin,
    uploadPoster.single('poster'),
    handleUploadError,
    uploadController.uploadMoviePoster,
);

/**
 * @swagger
 * /api/upload/episode/{episodeId}/video:
 *   post:
 *     summary: Upload and update episode video (Admin only)
 *     description: Upload a video file and automatically update the episode's videoUrl
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: episodeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Episode ID to update video
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file (mp4, webm, ogg, avi, mkv - max 500MB)
 *     responses:
 *       200:
 *         description: Video uploaded and episode updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Episode video updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     videoUrl:
 *                       type: string
 *                     episode:
 *                       type: object
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: Episode not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.post(
    '/episode/:episodeId/video',
    authenticate,
    isAdmin,
    uploadVideo.single('video'),
    handleUploadError,
    uploadController.uploadEpisodeVideo,
);

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload and update user avatar
 *     description: Upload an avatar image and automatically update the current user's avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (jpeg, png, gif, webp - max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded and user updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Avatar updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarUrl:
 *                       type: string
 *                     user:
 *                       type: object
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/avatar',
    authenticate,
    uploadImage.single('avatar'),
    handleUploadError,
    uploadController.uploadAvatar,
);

module.exports = router;
