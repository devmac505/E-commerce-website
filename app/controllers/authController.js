const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// @desc    Register a new B2B user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      companyName,
      email,
      password,
      companyAddress,
      businessRegistrationNumber,
      contactPerson
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      companyName,
      email,
      password,
      companyAddress,
      businessRegistrationNumber,
      contactPerson,
      role: 'buyer',
      approved: false // B2B users need approval
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful. Your account is pending approval.',
        data: {
          _id: user._id,
          companyName: user.companyName,
          email: user.email,
          role: user.role,
          approved: user.approved
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is approved
    if (!user.approved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true
    };

    // Add secure flag in production
    if (config.env === 'production') {
      options.secure = true;
    }

    res.status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: {
          _id: user._id,
          companyName: user.companyName,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user data'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
}; 