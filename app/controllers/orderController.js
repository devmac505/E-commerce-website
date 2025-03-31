const Order = require('../models/Order');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      items,
      billingAddress,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      notes,
      purchaseOrderNumber
    } = req.body;

    // Validate items and calculate prices
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Find product to get current price
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${item.product}`
        });
      }

      // Find size in available sizes
      const sizeInfo = product.availableSizes.find(s => s.size === item.size);
      
      if (!sizeInfo) {
        return res.status(400).json({
          success: false,
          message: `Size ${item.size} not available for product ${product.name}`
        });
      }

      // Check inventory
      if (sizeInfo.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough inventory for ${product.name} in size ${item.size}. Available: ${sizeInfo.inventory}`
        });
      }

      // Check min order quantity
      if (item.quantity < product.minOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
        });
      }

      // Calculate price based on bulk pricing if applicable
      let pricePerUnit = product.wholesalePrice;
      
      // Sort bulk pricing by quantity in descending order to find the best price
      if (product.bulkPricing && product.bulkPricing.length > 0) {
        const sortedPricing = [...product.bulkPricing].sort((a, b) => b.quantity - a.quantity);
        
        for (const pricing of sortedPricing) {
          if (item.quantity >= pricing.quantity) {
            pricePerUnit = pricing.price;
            break;
          }
        }
      }
      
      const totalPrice = pricePerUnit * item.quantity;
      subtotal += totalPrice;
      
      orderItems.push({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        price: pricePerUnit,
        totalPrice
      });

      // Update inventory (deduct ordered quantity)
      sizeInfo.inventory -= item.quantity;
      await product.save();
    }

    // Calculate tax and total (simplified - adjust based on tax rules)
    const taxRate = 0.08; // 8% tax rate - make this configurable
    const tax = subtotal * taxRate;
    
    // Calculate shipping cost (simplified - implement more complex logic as needed)
    const shippingCost = 25; // Flat shipping cost for B2B
    
    const total = subtotal + tax + shippingCost;
    
    // Create the order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      billingAddress,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      notes,
      subtotal,
      tax,
      shippingCost,
      total,
      purchaseOrderNumber,
      estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating order'
    });
  }
};

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('items.product', 'name sku images');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name sku images description');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Make sure user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, trackingInfo } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update fields if provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    // Add tracking info if provided
    if (trackingInfo && trackingInfo.carrier && trackingInfo.trackingNumber) {
      order.trackingInfo.push(trackingInfo);
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order'
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Order.countDocuments({});
    
    const orders = await Order.find()
      .populate('user', 'companyName email')
      .populate('items.product', 'name sku')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving orders'
    });
  }
}; 