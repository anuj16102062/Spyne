const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

router.post('/:id', authMiddleware, commentController.createComment);
router.put('/:id/comments/:commentId', authMiddleware, commentController.updateComment);
router.delete('/:id/comments/:commentId', authMiddleware, commentController.deleteComment);
router.post('/:id/comments/:commentId/like', authMiddleware, commentController.likeComment);
router.post('/:id/comments/:commentId/reply', authMiddleware, commentController.replyComment);

module.exports = router;
