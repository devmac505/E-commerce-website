const { Order, Product } = require('../models');

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      const error = new Error('No order items');
      error.statusCode = 400;
      throw error;
    }

    // Verify products and calculate prices
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        const error = new Error(`Product not found: ${item.product}`);
        error.statusCode = 404;
        throw error;
      }

      // Check if size is available
      const sizeItem = product.sizes.find(s => s.size === item.size);
      if (!sizeItem) {
        const error = new Error(`Size ${item.size} not available for product ${product.name}`);
        error.statusCode = 400;
        throw error;
      }

      // Check inventory
      if (sizeItem.inventory < item.quantity) {
        const error = new Error(`Not enough inventory for ${product.name} in size ${item.size}`);
        error.statusCode = 400;
        throw error;
      }

      // Calculate price based on quantity (bulk pricing)
      let pricePerUnit = product.basePrice;
      
      // Apply bulk pricing if applicable
      if (product.priceTiers && product.priceTiers.length > 0) {
        // Sort price tiers by quantity in descending order
        const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
        
        // Find the applicable price tier
        for (const tier of sortedTiers) {
          if (item.quantity >= tier.minQuantity) {
            pricePerUnit = tier.price;
            break;
          }
        }
      }

      const totalPrice = pricePerUnit * item.quantity;
      totalAmount += totalPrice;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        pricePerUnit,
        totalPrice
      });

      // Update inventory
      sizeItem.inventory -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private
 */
exports.getOrders = async (req, res, next) => {
  try {
    let query;

    // If user is not admin, show only their orders
    if (req.user.role !== 'admin') {
      query = Order.find({ user: req.user.id });
    } else {
      query = Order.find();
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Add filtering
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Execute query with pagination
    const orders = await query
      .populate('user', 'name email companyName')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Order.countDocuments(query.getFilter());

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email companyName')
      .populate('items.product', 'name sku images');

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    // Make sure user is order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      const error = new Error('Not authorized to access this order');
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      const error = new Error('Please provide a status');
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    order.status = status;
    
    // If order is delivered, update the delivery date
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update payment status
 * @route   PUT /api/orders/:id/payment
 * @access  Private/Admin
 */
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      const error = new Error('Please provide a payment status');
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    order.paymentStatus = paymentStatus;
    
    // If payment is completed, update the paid date
    if (paymentStatus === 'paid') {
      order.paidAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
