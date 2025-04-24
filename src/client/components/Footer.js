import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from './mock-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>
              WholesaleFootwear provides quality footwear solutions for retailers and distributors
              at competitive prices.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section links">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/products/category/casual">Casual Shoes</Link></li>
              <li><Link to="/products/category/formal">Formal Shoes</Link></li>
              <li><Link to="/products/category/sports">Sports Shoes</Link></li>
              <li><Link to="/products/category/boots">Boots</Link></li>
              <li><Link to="/products/category/sandals">Sandals</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>
              <FaMapMarkerAlt /> 123 Business Avenue, City, Country
            </p>
            <p>
              <FaPhone /> +1 234 567 8900
            </p>
            <p>
              <FaEnvelope /> info@wholesalefootwear.com
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Mark Anthony Custodio © {currentYear} WholesaleFootwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
