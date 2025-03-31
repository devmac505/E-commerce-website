const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Get all orders for logged in user
router.get('/', protect, getMyOrders);

// Get single order
router.get('/:id', protect, getOrder);

// Create new order
router.post(
  '/',
  [
    protect,
    [
      check('items', 'Items are required').isArray(),
      check('items.*.product', 'Product ID is required for each item').not().isEmpty(),
      check('items.*.size', 'Size is required for each item').not().isEmpty(),
      check('items.*.quantity', 'Quantity is required for each item').isNumeric(),
      check('billingAddress', 'Billing address is required').not().isEmpty(),
      check('shippingAddress', 'Shipping address is required').not().isEmpty(),
      check('paymentMethod', 'Payment method is required').not().isEmpty(),
      check('shippingMethod', 'Shipping method is required').not().isEmpty()
    ]
  ],
  createOrder
);

// Update order status (admin only)
router.put('/:id', protect, authorize('admin'), updateOrderStatus);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);

module.exports = router; 