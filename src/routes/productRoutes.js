const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProductInventory,
  updatePriceTiers
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { validate, productValidation } = require('../middleware/validator');

// Public routes
router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), validate(productValidation), createProduct);

router.route('/:id')
  .get(getProductById);

// Protected admin routes
router.route('/:productId/inventory')
  .put(protect, authorize('admin'), updateProductInventory);

router.route('/:productId/price-tiers')
  .put(protect, authorize('admin'), updatePriceTiers);

module.exports = router;
