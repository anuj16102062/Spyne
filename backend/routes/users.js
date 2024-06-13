const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', userController.getUsers);
router.get('/:name',userController.getUsersBySearchName);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/follow', authMiddleware, userController.followUser);

module.exports = router;
