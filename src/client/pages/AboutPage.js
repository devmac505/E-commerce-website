import React from 'react';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">About Us</h1>
        
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            WholesaleFootwear was founded in 2010 with a simple mission: to provide high-quality footwear at competitive wholesale prices to retailers and distributors worldwide. What started as a small family business has grown into a trusted partner for footwear businesses across the globe.
          </p>
          <p>
            Our journey began when our founder, a third-generation shoemaker, recognized the need for a reliable wholesale supplier that could bridge the gap between manufacturers and retailers. Today, we work with over 200 manufacturers and serve thousands of retailers in more than 50 countries.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Integrity</h3>
              <p>We believe in honest business practices and transparent relationships with our partners and customers.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>Quality</h3>
              <p>We never compromise on the quality of our products, ensuring that every pair of shoes meets our high standards.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Sustainability</h3>
              <p>We are committed to reducing our environmental footprint and promoting sustainable practices in the footwear industry.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>We support the communities where we operate through charitable initiatives and local partnerships.</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Our diverse team of footwear experts, logistics specialists, and customer service professionals work together to ensure that your wholesale experience is seamless and satisfying. With decades of combined experience in the footwear industry, our team is equipped to help you find the perfect products for your business.
          </p>
          <p>
            We pride ourselves on our personalized approach to customer service. When you work with WholesaleFootwear, you're not just a customer – you're a valued partner in our shared success.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Commitment</h2>
          <p>
            At WholesaleFootwear, we are committed to:
          </p>
          <ul className="commitment-list">
            <li>Providing high-quality footwear at competitive prices</li>
            <li>Offering a diverse range of styles to meet the needs of different markets</li>
            <li>Ensuring timely delivery and reliable logistics</li>
            <li>Supporting our customers with exceptional service</li>
            <li>Continuously improving our products and processes</li>
          </ul>
          <p>
            We look forward to being your trusted wholesale footwear partner for years to come.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
