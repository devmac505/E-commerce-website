const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['athletic', 'formal', 'casual', 'boots', 'sandals', 'slippers', 'other']
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'children'],
    required: true
  },
  images: [String],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than 0']
  },
  wholesalePrice: {
    type: Number,
    required: [true, 'Wholesale price is required'],
    min: [0, 'Wholesale price must be greater than 0']
  },
  bulkPricing: [{
    quantity: Number,
    price: Number
  }],
  availableSizes: [{
    size: String,
    inventory: {
      type: Number,
      default: 0
    },
    minOrderQuantity: {
      type: Number,
      default: 1
    }
  }],
  materials: [String],
  colors: [String],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  minOrderQuantity: {
    type: Number,
    default: 10
  },
  leadTime: {
    type: String,
    default: '2-4 weeks'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating product availability status
ProductSchema.virtual('availabilityStatus').get(function() {
  const totalInventory = this.availableSizes.reduce((sum, size) => sum + size.inventory, 0);
  if (totalInventory === 0) return 'Out of Stock';
  if (totalInventory < 100) return 'Low Stock';
  return 'In Stock';
});

module.exports = mongoose.model('Product', ProductSchema); 