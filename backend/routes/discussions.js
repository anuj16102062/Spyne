const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/auth');
router.get('/', authMiddleware, discussionController.getDiscussion);
router.post('/', authMiddleware, discussionController.createDiscussion);
router.put('/:id', authMiddleware, discussionController.updateDiscussion);
router.delete('/:id', authMiddleware, discussionController.deleteDiscussion);
router.get('/tag/:tag', discussionController.getDiscussionsByTag);
router.get('/text/:text', discussionController.getDiscussionsByText);

module.exports = router;
