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

  // Get the appropriate image based on product name
  const getProductImage = () => {
    // Map product names to their image files
    const imageMap = {
      'Urban Combat': '/images/urban-combat.jpg',
      'Wilderness Hiker': '/images/wilderness-hiking.jpg',
      'Elegant Heel': '/images/elegant-heel.jpg',
      'Executive Oxford': '/images/Executive-Oxford.jpg'
    };

    // Return the mapped image or use the product's image property as fallback
    return imageMap[product.name] || product.image || `/images/${product.category?.toLowerCase()}.jpg`;
  };

  // Fallback image if the product image fails to load
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `/images/product-placeholder.svg`;
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card" data-product-id={product.id}>
      <div className="product-image">
        <img
          src={getProductImage()}
          alt={product.name}
          onError={handleImageError}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatCurrency(product.price)}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
