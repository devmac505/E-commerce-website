const { body, validationResult } = require('express-validator');

/**
 * Middleware to validate request data
 * @param {Array} validations - Array of express-validator validations
 * @returns {Function} Middleware function
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.path] = error.msg;
    });

    // Return validation errors
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: formattedErrors
    });
  };
};

/**
 * User registration validation rules
 */
const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('companyName')
    .optional(),

  body('phone')
    .optional()
    .if(body('phone').exists().notEmpty())
    .isLength({ min: 11, max: 11 }).withMessage('number is not valid')
];

/**
 * User login validation rules
 */
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Product creation validation rules
 */
const productValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('sku')
    .notEmpty().withMessage('SKU is required')
    .isLength({ min: 3, max: 20 }).withMessage('SKU must be between 3 and 20 characters'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),

  body('brand')
    .notEmpty().withMessage('Brand is required'),

  body('basePrice')
    .notEmpty().withMessage('Base price is required')
    .isNumeric().withMessage('Base price must be a number')
    .custom(value => value > 0).withMessage('Base price must be greater than 0'),

  body('images')
    .isArray().withMessage('Images must be an array')
    .notEmpty().withMessage('At least one image is required'),

  body('sizes')
    .isArray().withMessage('Sizes must be an array')
    .notEmpty().withMessage('At least one size is required'),

  body('sizes.*.size')
    .notEmpty().withMessage('Size value is required'),

  body('sizes.*.inventory')
    .isInt({ min: 0 }).withMessage('Inventory must be a non-negative integer')
];

/**
 * Order creation validation rules
 */
const orderValidation = [
  body('items')
    .isArray().withMessage('Items must be an array')
    .notEmpty().withMessage('At least one item is required'),

  body('items.*.product')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),

  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  body('items.*.size')
    .notEmpty().withMessage('Size is required'),

  body('shippingAddress')
    .notEmpty().withMessage('Shipping address is required'),

  body('shippingAddress.street')
    .notEmpty().withMessage('Street is required'),

  body('shippingAddress.city')
    .notEmpty().withMessage('City is required'),

  body('shippingAddress.state')
    .notEmpty().withMessage('State is required'),

  body('shippingAddress.zipCode')
    .notEmpty().withMessage('Zip code is required'),

  body('shippingAddress.country')
    .notEmpty().withMessage('Country is required'),

  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  orderValidation
};
