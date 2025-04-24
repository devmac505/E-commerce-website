const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProductInventory,
  updatePriceTiers,
  searchProducts,
  getRelatedProducts
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
const { cacheMiddleware } = require('../middleware/cache');

// Public routes
router.route('/')
  .get(cacheMiddleware(300), getProducts) // Cache for 5 minutes
  .post(protect, authorize('admin'), validate(productValidation), createProduct);

// Search route
router.route('/search')
  .get(cacheMiddleware(300), searchProducts); // Cache for 5 minutes

// Related products route
router.route('/related/:id')
  .get(cacheMiddleware(600), getRelatedProducts); // Cache for 10 minutes

router.route('/:id')
  .get(cacheMiddleware(600), getProductById); // Cache for 10 minutes

// Categories route
router.route('/categories')
  .get(cacheMiddleware(1800), getCategories); // Cache for 30 minutes

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
