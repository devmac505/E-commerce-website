const Product = require('../models/Product');

/**
 * @desc    Upload product image
 * @route   POST /api/products/:id/image
 * @access  Private/Admin
 */
exports.uploadProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // If no file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image file'
      });
    }

    // Create the image path (relative to public directory)
    const imagePath = `/uploads/products/${req.file.filename}`;

    // Add the new image to the product's images array
    product.images.push(imagePath);
    await product.save();

    res.status(200).json({
      success: true,
      data: {
        image: imagePath,
        product: product
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Set product featured image
 * @route   PUT /api/products/:id/featured-image
 * @access  Private/Admin
 */
exports.setFeaturedImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imageIndex } = req.body;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Validate image index
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image index'
      });
    }

    // Reorder images to make the selected image the first one (featured)
    const selectedImage = product.images[imageIndex];
    product.images.splice(imageIndex, 1); // Remove the image from its current position
    product.images.unshift(selectedImage); // Add it to the beginning of the array

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product image
 * @route   DELETE /api/products/:id/image/:imageIndex
 * @access  Private/Admin
 */
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageIndex } = req.params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Validate image index
    const index = parseInt(imageIndex);
    if (isNaN(index) || index < 0 || index >= product.images.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image index'
      });
    }

    // Remove the image from the array
    product.images.splice(index, 1);
    
    // If no images left, add a placeholder
    if (product.images.length === 0) {
      product.images.push('/images/products/placeholder.svg');
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
