const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/', protect, authorize('admin', 'manager'), orderController.getAllOrders);
router.put('/:id/status', protect, authorize('admin', 'manager'), orderController.updateOrderStatus);

module.exports = router;