const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validate, orderValidation } = require('../middleware/validator');

// All order routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .post(validate(orderValidation), createOrder)
  .get(getOrders);

router.route('/:id')
  .get(getOrderById);

// Admin only routes
router.route('/:id/status')
  .put(authorize('admin'), updateOrderStatus);

router.route('/:id/payment')
  .put(authorize('admin'), updatePaymentStatus);

module.exports = router;
