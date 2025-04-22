import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductAPI } from '../services/api';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set hero banner background image when component mounts
  useEffect(() => {
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      heroElement.style.backgroundImage = `linear-gradient(rgba(26, 34, 56, 0.7), rgba(26, 34, 56, 0.7)), url('/images/hero-banner.jpg')`;
    }
  }, []);

  // Fetch featured products and categories when component mounts
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch featured products (limit to 4)
        const response = await ProductAPI.getProducts({ limit: 4, featured: true });

        if (response.success && response.data) {
          // Transform API data to match our expected format
          const formattedProducts = response.data.map(product => ({
            id: product._id,
            name: product.name,
            price: product.basePrice,
            image: product.images && product.images.length > 0
              ? product.images[0]
              : '/images/products/placeholder.svg',
            category: product.category?.name || 'Unknown',
            gender: product.specifications?.gender || 'unisex'
          }));

          setFeaturedProducts(formattedProducts);
        } else {
          // If no products returned, use sample data
          setFeaturedProducts(getSampleProducts());
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
        // Use sample data as fallback
        setFeaturedProducts(getSampleProducts());
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await ProductAPI.getCategories();

        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          // If no categories returned, use sample data
          setCategories(getSampleCategories());
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Use sample data as fallback
        setCategories(getSampleCategories());
      }
    };

    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  // Sample products for fallback
  const getSampleProducts = () => {
    return [
      {
        id: 'sample1',
        name: 'Athletic Running Shoes',
        price: 79.99,
        image: '/images/products/running-shoes.jpg',
        category: 'Athletic',
        gender: 'unisex'
      },
      {
        id: 'sample2',
        name: 'Casual Leather Loafers',
        price: 59.99,
        image: '/images/products/loafers.jpg',
        category: 'Casual',
        gender: 'men'
      },
      {
        id: 'sample3',
        name: 'Formal Business Oxfords',
        price: 89.99,
        image: '/images/products/oxfords.jpg',
        category: 'Formal',
        gender: 'men'
      },
      {
        id: 'sample4',
        name: 'Women\'s Fashion Boots',
        price: 99.99,
        image: '/images/products/boots.jpg',
        category: 'Boots',
        gender: 'women'
      }
    ];
  };

  // Sample categories for fallback
  const getSampleCategories = () => {
    return [
      { _id: 'athletic', name: 'Athletic', image: '/images/categories/athletic.jpg' },
      { _id: 'casual', name: 'Casual', image: '/images/categories/casual.jpg' },
      { _id: 'formal', name: 'Formal', image: '/images/categories/formal.jpg' },
      { _id: 'boots', name: 'Boots', image: '/images/categories/boots.jpg' }
    ];
  };

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="fade-in">Wholesale Footwear Solutions for Your Business</h1>
            <p className="slide-in-right">Quality shoes at competitive prices for retailers and distributors</p>
            <Link to="/products" className="btn btn-primary explore-btn slide-in-up">
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="feature-grid">
            <div className="feature-card stagger-item hover-lift hover-shadow">
              <div className="feature-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <h3>Bulk Ordering</h3>
              <p>Order in bulk and enjoy volume discounts on our entire catalog.</p>
            </div>

            <div className="feature-card stagger-item hover-lift hover-shadow">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Fast Shipping</h3>
              <p>Quick delivery to your warehouse or store with tracking available.</p>
            </div>

            <div className="feature-card stagger-item hover-lift hover-shadow">
              <div className="feature-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3>Quality Products</h3>
              <p>Premium materials and craftsmanship for durable footwear.</p>
            </div>

            <div className="feature-card stagger-item hover-lift hover-shadow">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Dedicated Support</h3>
              <p>Personal account managers to assist with your wholesale needs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-description">
            Explore our most popular wholesale footwear options
          </p>

          <div className="product-grid" id="featuredProductsGrid">
            {loading ? (
              // Show skeleton loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="product-card skeleton"></div>
              ))
            ) : error ? (
              // Show error message
              <div className="error-message">{error}</div>
            ) : featuredProducts.length > 0 ? (
              // Show featured products
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              // No products found
              <div className="no-products-message">
                <p>No featured products available at the moment.</p>
              </div>
            )}
          </div>

          <div className="view-all-container">
            <Link to="/products" className="btn btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            {categories.length > 0 ? (
              // Show categories from API or fallback
              categories.map(category => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    <img
                      src={category.image || `https://via.placeholder.com/300x200/1a2238/ffffff?text=${category.name}`}
                      alt={`${category.name} Shoes`}
                      onError={(e) => {
                        // Fallback image if the category image fails to load
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200/1a2238/ffffff?text=Category';
                      }}
                    />
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              ))
            ) : (
              // Show loading skeletons if no categories
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="category-card skeleton">
                  <div className="category-image skeleton"></div>
                  <h3 className="skeleton-text"></h3>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
