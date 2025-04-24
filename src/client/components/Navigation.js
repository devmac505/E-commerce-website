import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUser } from './mock-icons';
import { subscribeToAuthState, logout, getAuthState } from '../services/authState';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    // This will be called whenever auth state changes
    const handleAuthStateChange = (authState) => {
      console.log('Navigation received auth state update:', authState);
      setIsLoggedIn(authState.isLoggedIn);
      setUserName(authState.userName);
      setUserRole(authState.userRole);
    };

    // Subscribe to auth state changes and get unsubscribe function
    const unsubscribe = subscribeToAuthState(handleAuthStateChange);

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // Call the centralized logout function
    logout();

    // Close menu if open
    closeMenu();

    // Redirect to home page
    navigate('/');
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="main-nav">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              WholesaleFootwear
            </Link>
          </div>

          <div className="nav-menu">
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <ul>
                <li>
                  <Link
                    to="/"
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className={location.pathname.includes('/products') ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className={location.pathname === '/about' ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={location.pathname === '/contact' ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="nav-actions">
              {isLoggedIn ? (
                // Logged in user actions
                <div className="user-menu">
                  <span className="user-greeting">
                    <FaUser className="user-icon" />
                    <span className="user-name">{userName}</span>
                  </span>
                  {userRole === 'admin' && (
                    <Link to="/admin" className="admin-link" onClick={closeMenu}>
                      ADMIN
                    </Link>
                  )}
                  <button className="logout-btn" onClick={handleLogout}>
                    LOGOUT
                  </button>
                </div>
              ) : (
                // Guest actions
                <>
                  <span className="guest-label">Guest</span>
                  <Link to="/login" className="login-link" onClick={closeMenu}>
                    LOGIN
                  </Link>
                  <Link to="/register" className="register-link" onClick={closeMenu}>
                    REGISTER
                  </Link>
                </>
              )}
              <Link to="/cart" className="cart-icon" onClick={closeMenu}>
                <FaShoppingCart />
              </Link>
              <button
                className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
