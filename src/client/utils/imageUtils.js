/**
 * Utility functions for handling images
 */

/**
 * Converts a product name to a standardized image filename
 * @param {string} productName - The name of the product
 * @returns {string} - The standardized image path
 */
export const getProductImagePath = (productName) => {
  if (!productName) return '/images/products/product-placeholder.svg';
  
  // Convert to lowercase, replace spaces with hyphens, and add jpg extension
  const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
  return `/images/products/${formattedName}.jpg`;
};

/**
 * Converts a category name to a standardized image filename
 * @param {string} categoryName - The name of the category
 * @returns {string} - The standardized image path
 */
export const getCategoryImagePath = (categoryName) => {
  if (!categoryName) return '/images/categories/casual.svg';
  
  // Convert to lowercase for category images
  const formattedName = categoryName.toLowerCase();
  return `/images/categories/${formattedName}.svg`;
};
