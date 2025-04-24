import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="main-nav">
      <div className="container nav-container">
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            <span className="logo-text">WholesaleFootwear</span>
          </Link>
        </div>

        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''} 
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className={isActive('/products') ? 'active' : ''} 
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={isActive('/about') ? 'active' : ''} 
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={isActive('/contact') ? 'active' : ''} 
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu}>
            <i className="fas fa-user"></i> Login
          </Link>
          <Link to="/cart" className="cart-icon" onClick={closeMobileMenu}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
