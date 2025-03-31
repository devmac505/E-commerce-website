const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Get all products (buyers)
router.get('/', protect, getProducts);

// Get featured products
router.get('/featured', protect, getFeaturedProducts);

// Get single product
router.get('/:id', protect, getProduct);

// Create product (admin only)
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('sku', 'SKU is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('gender', 'Gender is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('wholesalePrice', 'Wholesale price is required').isNumeric(),
      check('availableSizes', 'Available sizes are required').isArray()
    ]
  ],
  createProduct
);

// Update product (admin only)
router.put('/:id', protect, authorize('admin'), updateProduct);

// Delete product (admin only)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router; 