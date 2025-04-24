import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Handle missing product data gracefully
  if (!product) {
    return <div className="product-card skeleton"></div>;
  }

  const { id, name, price, image, category, discount = 0 } = product;
  
  // Calculate discounted price if applicable
  const discountedPrice = discount > 0 
    ? price * (1 - discount / 100) 
    : price;

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-image">
        <img 
          src={image} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x300/1a2238/ffffff?text=Product+Image';
          }}
        />
        {discount > 0 && (
          <span className="discount-badge">{discount}% OFF</span>
        )}
      </Link>
      <div className="product-info">
        <Link to={`/products/${id}`}>
          <h3>{name}</h3>
        </Link>
        <p className="product-category">{category}</p>
        <div className="product-price">
          {discount > 0 ? (
            <>
              <span className="original-price">${price.toFixed(2)}</span>
              <span className="discounted-price">
                ${discountedPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">${price.toFixed(2)}</span>
          )}
        </div>
        <button className="btn btn-primary add-to-cart-btn">
          <i className="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
