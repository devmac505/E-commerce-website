import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-header">
        <button className="close-menu" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <nav className="mobile-nav">
        <ul>
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={onClose}
            >
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              className={location.pathname === '/products' ? 'active' : ''}
              onClick={onClose}
            >
              <i className="fas fa-box"></i> Products
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
              onClick={onClose}
            >
              <i className="fas fa-info-circle"></i> About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''}
              onClick={onClose}
            >
              <i className="fas fa-envelope"></i> Contact
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className={location.pathname === '/cart' ? 'active' : ''}
              onClick={onClose}
            >
              <i className="fas fa-shopping-cart"></i> Cart
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mobile-menu-footer">
        <Link to="/login" className="btn btn-secondary" onClick={onClose}>Login</Link>
        <Link to="/register" className="btn btn-primary" onClick={onClose}>Register</Link>
      </div>
    </div>
  );
}

export default MobileMenu;
