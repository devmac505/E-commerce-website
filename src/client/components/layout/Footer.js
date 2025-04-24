import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>
              WholesaleFootwear is a B2B marketplace connecting footwear manufacturers 
              with retailers and distributors worldwide.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
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
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><i className="fas fa-map-marker-alt"></i> 123 Business Ave, Suite 100, City, Country</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-envelope"></i> info@wholesalefootwear.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Mark Anthony Custodio © 2025 WholesaleFootwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
