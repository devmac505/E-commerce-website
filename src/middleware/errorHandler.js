/**
 * Custom error handling middleware
 * Provides consistent error responses across the API
 */
const errorHandler = (err, req, res, next) => {
  console.error('ERROR OCCURRED:');
  console.error(`URL: ${req.method} ${req.originalUrl}`);
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  if (err.name) {
    console.error(`Error name: ${err.name}`);
  }

  if (err.code) {
    console.error(`Error code: ${err.code}`);
  }

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = {};

    // Extract validation error messages
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });

    return res.status(statusCode).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
  }

  // Handle Mongoose cast errors (invalid IDs)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
