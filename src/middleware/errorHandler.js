/**
 * Custom error handling middleware
 * Provides consistent error responses across the API
 *
 * Error response format:
 * {
 *   success: false,
 *   error: "Error message",
 *   details: { field1: "Error for field1", field2: "Error for field2" }, // For validation errors
 *   code: "ERROR_CODE", // For specific error types
 *   stack: "Stack trace" // Only in development
 * }
 */

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'APIError';
  }
}

// Export the APIError class
module.exports.APIError = APIError;
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

  // Handle SyntaxError (usually from invalid JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file upload field';
  }

  // Handle network/database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    statusCode = 503;
    message = 'Database connection error';
  }

  // Handle API errors with our custom class
  const errorResponse = {
    success: false,
    error: message
  };

  // Add error code if available
  if (err.code && typeof err.code === 'string') {
    errorResponse.code = err.code;
  }

  // Add error details if available
  if (err.details) {
    errorResponse.details = err.details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  // Add request ID if available
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  // Log error to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // Here you would integrate with a monitoring service like Sentry
    // Example: Sentry.captureException(err);
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
