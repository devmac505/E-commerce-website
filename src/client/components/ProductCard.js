import React, { useState } from 'react';
import { showToast } from './ToastContainer';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Set animation state
    setIsAddingToCart(true);

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));

    // Show toast notification
    showToast(`Added ${product.name} to cart!`, 'success');

    // Reset animation state after a delay
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 800);
  };

  return (
    <div className="product-card" data-product-id={product.id}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatCurrency(product.price)}</p>
        <div className="product-category">
          {product.category} • {product.gender}
        </div>
        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-primary">
            View Details
          </Link>
          <button
            className={`btn btn-secondary add-to-cart ${isAddingToCart ? 'add-to-cart-animation' : ''}`}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <i className="fas fa-check success-checkmark"></i>
            ) : (
              <i className="fas fa-shopping-cart"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
