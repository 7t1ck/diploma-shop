const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/categories', productController.getAllCategories);
router.get('/brands', productController.getAllBrands);

module.exports = router;