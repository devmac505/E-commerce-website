const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Protect routes - Middleware to verify JWT token and attach user to request
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if auth header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check if token exists in cookies (for web clients)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      throw error;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        throw error;
      }

      next();
    } catch (err) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize by role - Middleware to restrict access based on user role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('User not authenticated');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

module.exports = { protect, authorize };