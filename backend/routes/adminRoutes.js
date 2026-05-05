const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin', 'manager'), adminController.getStats);
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);

module.exports = router;