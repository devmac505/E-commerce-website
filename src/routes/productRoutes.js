const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProductInventory,
  updatePriceTiers
} = require('../controllers/productController');
const { getCategories } = require('../controllers/categoryController');
const {
  uploadProductImage,
  setFeaturedImage,
  deleteProductImage
} = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const { validate, productValidation } = require('../middleware/validator');
const upload = require('../middleware/upload');

// Public routes
router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), validate(productValidation), createProduct);

router.route('/:id')
  .get(getProductById);

// Categories route
router.route('/categories')
  .get(getCategories);

// Protected admin routes
router.route('/:productId/inventory')
  .put(protect, authorize('admin'), updateProductInventory);

router.route('/:productId/price-tiers')
  .put(protect, authorize('admin'), updatePriceTiers);

// Image upload routes
router.route('/:id/image')
  .post(protect, authorize('admin'), upload.single('image'), uploadProductImage);

router.route('/:id/featured-image')
  .put(protect, authorize('admin'), setFeaturedImage);

router.route('/:id/image/:imageIndex')
  .delete(protect, authorize('admin'), deleteProductImage);

module.exports = router;
