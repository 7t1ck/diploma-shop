const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);

// Тільки адмін
router.post('/', protect, authorize('admin'), productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;