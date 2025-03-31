const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register user
router.post(
  '/register',
  [
    check('companyName', 'Company name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('businessRegistrationNumber', 'Business registration number is required').not().isEmpty()
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// Get current user
router.get('/me', protect, getMe);

// Logout user
router.get('/logout', protect, logout);

module.exports = router; 