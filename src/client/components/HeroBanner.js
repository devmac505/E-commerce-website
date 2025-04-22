import React, { useEffect } from 'react';

const HeroBanner = () => {
  useEffect(() => {
    // Add the hero banner image to the hero section
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      heroElement.style.backgroundImage = `linear-gradient(rgba(26, 34, 56, 0.7), rgba(26, 34, 56, 0.7)), url('/images/hero-banner.jpg')`;
    }
  }, []);

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Discover Quality Products</h1>
        <p>Shop the latest trends with confidence and style</p>
        <a href="/products" className="btn btn-primary explore-btn">Explore Now</a>
      </div>
    </div>
  );
};

export default HeroBanner;
