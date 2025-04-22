const Product = require('../models/Product');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products with filtering, pagination and sorting
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    console.log('GET /api/products - Request received');
    console.log('Query params:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
      console.log('Filtering by category:', req.query.category);
    }

    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.basePrice = {};
      if (req.query.minPrice) filter.basePrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.basePrice.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Default to active products only
    filter.isActive = true;

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    console.log('Filter criteria:', filter);

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`Found ${products.length} products`);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        perPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product inventory
 * @route   PATCH /api/products/:productId/inventory
 * @access  Private/Admin
 */
exports.updateProductInventory = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { sizeUpdates } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Update inventory for each size
    sizeUpdates.forEach(update => {
      const sizeItem = product.sizes.find(s => s.size === update.size);
      if (sizeItem) {
        sizeItem.inventory = update.inventory;
      }
    });

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product price tiers
 * @route   PATCH /api/products/:productId/price-tiers
 * @access  Private/Admin
 */
exports.updatePriceTiers = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { priceTiers } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    product.priceTiers = priceTiers;
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};