import React from 'react';
import { FaHandshake, FaAward, FaLeaf, FaUsers } from '../components/mock-icons';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-banner">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="banner-subtitle">Learn more about our company, values, and mission</p>
        </div>
      </div>
      <div className="container">

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
                <FaHandshake />
              </div>
              <h3>Integrity</h3>
              <p>We believe in honest business practices and transparent relationships with our partners and customers.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaAward />
              </div>
              <h3>Quality</h3>
              <p>We never compromise on the quality of our products, ensuring that every pair of shoes meets our high standards.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaLeaf />
              </div>
              <h3>Sustainability</h3>
              <p>We are committed to reducing our environmental footprint and promoting sustainable practices in the footwear industry.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaUsers />
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
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-image">
                <div className="placeholder-image">JD</div>
              </div>
              <h3>John Doe</h3>
              <p className="team-title">CEO & Founder</p>
              <p className="team-bio">With over 20 years of experience in the footwear industry, John leads our company with passion and vision.</p>
            </div>
            <div className="team-member">
              <div className="team-member-image">
                <div className="placeholder-image">JS</div>
              </div>
              <h3>Jane Smith</h3>
              <p className="team-title">Head of Operations</p>
              <p className="team-bio">Jane ensures that our logistics and operations run smoothly, delivering products on time, every time.</p>
            </div>
            <div className="team-member">
              <div className="team-member-image">
                <div className="placeholder-image">RJ</div>
              </div>
              <h3>Robert Johnson</h3>
              <p className="team-title">Product Manager</p>
              <p className="team-bio">Robert works closely with manufacturers to curate our extensive collection of quality footwear.</p>
            </div>
          </div>
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
