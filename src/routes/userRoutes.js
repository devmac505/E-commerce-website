const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate, registerValidation, loginValidation } = require('../middleware/validator');

// Public routes
router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
