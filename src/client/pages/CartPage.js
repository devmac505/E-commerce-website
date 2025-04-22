import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
      
      // Calculate total
      const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotal(cartTotal);
    };
    
    loadCart();
    
    // Listen for storage events (for cart updates from other components)
    const handleStorageChange = () => {
      loadCart();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update total
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };
  
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update total
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
    
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  };
  
  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  };
  
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };
  
  return (
    <div className="container">
      <h1 className="page-title">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">{formatCurrency(item.price)}</p>
                </div>
                
                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-subtotal">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                <button 
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <div className="cart-actions">
              <button 
                className="btn btn-secondary" 
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <Link to="/checkout" className="btn btn-primary">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
