import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>WholesaleFootwear</h3>
            <p>Your trusted partner for wholesale footwear solutions. Quality products at competitive prices.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/products?category=athletic">Athletic</Link></li>
              <li><Link to="/products?category=casual">Casual</Link></li>
              <li><Link to="/products?category=formal">Formal</Link></li>
              <li><Link to="/products?category=boots">Boots</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p><i className="fas fa-map-marker-alt"></i> 123 Business Ave, Suite 100</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-envelope"></i> info@wholesalefootwear.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} WholesaleFootwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
