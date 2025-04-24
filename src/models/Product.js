const mongoose = require('mongoose');

const priceTierSchema = new mongoose.Schema({
  minQuantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const productSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  priceTiers: [priceTierSchema],
  basePrice: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [{
    size: {
      type: String,
      required: true
    },
    inventory: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  specifications: {
    material: String,
    color: String,
    style: String,
    origin: String
  },
  minOrderQuantity: {
    type: Number,
    required: true,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
