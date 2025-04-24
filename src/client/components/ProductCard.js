import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from './mock-icons';
import { getProductImagePath } from '../utils/imageUtils';

const ProductCard = ({ product }) => {
  // Default product if none is provided
  const defaultProduct = {
    _id: 'default',
    name: 'Product Name',
    category: 'Category',
    price: 99.99,
    originalPrice: 129.99,
    image: '/images/products/product-placeholder.svg', // Will be replaced with actual image
    discount: 20
  };

  // Use provided product or default
  const { _id, name, category, price, originalPrice, image, discount } = product || defaultProduct;

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/products/${_id}`}>
          <img
            src={image || getProductImagePath(name)}
            alt={name}
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              e.target.onerror = null;
              e.target.src = '/images/products/product-placeholder.svg';
            }}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="product-info">
        <h3>
          <Link to={`/products/${_id}`}>{name}</Link>
        </h3>
        <div className="product-price">
          ${price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
