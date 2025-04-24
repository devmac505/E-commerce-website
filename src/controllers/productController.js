const Product = require('../models/Product');
const { clearCache } = require('../middleware/cache');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    // Clear product cache when a new product is created
    clearCache('/api/products*');

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

    // Enhanced pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Category filtering - support multiple categories
    if (req.query.category) {
      if (Array.isArray(req.query.category)) {
        filter.category = { $in: req.query.category };
      } else {
        filter.category = req.query.category;
      }
      console.log('Filtering by category:', req.query.category);
    }

    // Brand filtering - support multiple brands
    if (req.query.brand) {
      if (Array.isArray(req.query.brand)) {
        filter.brand = { $in: req.query.brand };
      } else {
        filter.brand = req.query.brand;
      }
    }

    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      filter.basePrice = {};
      if (req.query.minPrice) filter.basePrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.basePrice.$lte = parseFloat(req.query.maxPrice);
    }

    // Enhanced search functionality
    if (req.query.search) {
      // If MongoDB text index is set up
      filter.$text = { $search: req.query.search };

      // For fuzzy search without relying on text index, use regex (less efficient but more flexible)
      // const searchRegex = new RegExp(req.query.search, 'i');
      // filter.$or = [
      //   { name: searchRegex },
      //   { description: searchRegex },
      //   { brand: searchRegex }
      // ];
    }

    // Filter by specifications
    if (req.query.color) {
      filter['specifications.color'] = req.query.color;
    }

    if (req.query.material) {
      filter['specifications.material'] = req.query.material;
    }

    if (req.query.style) {
      filter['specifications.style'] = req.query.style;
    }

    // Inventory filtering
    if (req.query.inStock === 'true') {
      filter['sizes.inventory'] = { $gt: 0 };
    }

    // Default to active products only
    filter.isActive = true;

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    // Filter by featured status
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
      console.log('Filtering by featured status:', filter.featured);
    }

    console.log('Filter criteria:', filter);

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default sort by newest

    if (req.query.sortBy) {
      sortOptions = {};
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      // Handle different sort fields
      switch (sortField) {
        case 'price':
          sortOptions.basePrice = sortOrder;
          break;
        case 'name':
          sortOptions.name = sortOrder;
          break;
        case 'popularity':
          // This would require tracking product views/sales
          sortOptions.createdAt = sortOrder;
          break;
        default:
          sortOptions.createdAt = sortOrder;
      }
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('category')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    console.log(`Found ${products.length} products`);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate next and previous page URLs
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const nextPage = page < Math.ceil(total / limit)
      ? `${baseUrl}?page=${page + 1}&limit=${limit}`
      : null;
    const prevPage = page > 1
      ? `${baseUrl}?page=${page - 1}&limit=${limit}`
      : null;

    // Set cache control headers for client-side caching
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        perPage: limit,
        next: nextPage,
        prev: prevPage
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

    // Clear cache for this product and product listings
    clearCache(`/api/products/${productId}*`);
    clearCache('/api/products*');

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

    // Clear cache for this product and product listings
    clearCache(`/api/products/${productId}*`);
    clearCache('/api/products*');

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

    // Set cache control headers for client-side caching
    res.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
exports.searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Use text search if MongoDB text index is set up
    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } } // Add text score
    )
    .sort({ score: { $meta: 'textScore' } }) // Sort by relevance
    .limit(20);

    // Set cache control headers
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get related products
 * @route   GET /api/products/related/:id
 * @access  Public
 */
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
    .limit(parseInt(req.query.limit) || 4);

    // Set cache control headers
    res.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};