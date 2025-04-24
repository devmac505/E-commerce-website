import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductAPI } from '../services/api';
import { subscribeToAuthState } from '../services/authState';
import { getProductImagePath, getCategoryImagePath } from '../utils/imageUtils';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);


  useEffect(() => {
    // This will be called whenever auth state changes
    const handleAuthStateChange = (authState) => {
      console.log('HomePage received auth state update:', authState);
      setIsLoggedIn(authState.isLoggedIn);
      setUserName(authState.userName);
    };

    // Subscribe to auth state changes and get unsubscribe function
    const unsubscribe = subscribeToAuthState(handleAuthStateChange);

    // Check if this is a new login
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      const loginTime = parseInt(loginTimestamp, 10);
      const currentTime = Date.now();

      // If login was within the last 2 seconds, show welcome message
      if (currentTime - loginTime < 2000) {
        setShowWelcome(true);

        // Hide welcome message after 5 seconds
        setTimeout(() => {
          setShowWelcome(false);
        }, 5000);

        // Clear the timestamp
        localStorage.removeItem('loginTimestamp');
      }
    }

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
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
            // Use utility function for consistent image paths
            image: getProductImagePath(product.name),
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
        name: 'Urban Combat',
        price: 119.99,
        image: getProductImagePath('Urban Combat'),
        category: 'Boots',
        gender: 'unisex'
      },
      {
        id: 'sample2',
        name: 'Wilderness Hiker',
        price: 149.99,
        image: getProductImagePath('Wilderness Hiker'),
        category: 'Athletic',
        gender: 'men'
      },
      {
        id: 'sample3',
        name: 'Elegant Heel',
        price: 89.99,
        image: getProductImagePath('Elegant Heel'),
        category: 'Formal',
        gender: 'women'
      },
      {
        id: 'sample4',
        name: 'Executive Oxford',
        price: 129.99,
        image: getProductImagePath('Executive Oxford'),
        category: 'Formal',
        gender: 'men'
      }
    ];
  };

  // Sample categories for fallback
  const getSampleCategories = () => {
    return [
      { _id: 'athletic', name: 'Athletic', image: getCategoryImagePath('Athletic') },
      { _id: 'casual', name: 'Casual', image: getCategoryImagePath('Casual') },
      { _id: 'formal', name: 'Formal', image: getCategoryImagePath('Formal') },
      { _id: 'boots', name: 'Boots', image: getCategoryImagePath('Boots') }
    ];
  };

  return (
    <>
      {showWelcome && (
        <div className="container" style={{ marginTop: '1rem' }}>
          <div className="notification notification-success">
            <strong>Welcome, {userName}!</strong> You have successfully logged in to your account.
          </div>
        </div>
      )}

      <div className="hero" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
        <div className="hero-image">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            {isLoggedIn ? (
              <h1>Welcome Back, {userName}!<br />Explore Our Latest Products</h1>
            ) : (
              <h1>Wholesale Footwear Solutions<br />for Your Business</h1>
            )}
            <p>Quality shoes at competitive prices for retailers and distributors</p>
            <Link to="/products" className="btn btn-primary explore-btn">
              EXPLORE PRODUCTS
            </Link>
          </div>
        </div>
      </div>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-box-open"></i>
              </div>
              <h3>Bulk Ordering</h3>
              <p>Order in bulk and enjoy volume discounts on our entire catalog.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Fast Shipping</h3>
              <p>Quick delivery to your warehouse or store with tracking available.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3>Quality Products</h3>
              <p>Premium materials and craftsmanship for durable footwear.</p>
            </div>

            <div className="feature-card">
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

          <div className="category-grid" id="featuredProductsGrid">
            {loading ? (
              // Show skeleton loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="category-card skeleton">
                  <div className="category-image skeleton"></div>
                  <h3 className="skeleton-text"></h3>
                </div>
              ))
            ) : error ? (
              // Show error message
              <div className="error-message">{error}</div>
            ) : featuredProducts.length > 0 ? (
              // Show featured products
              featuredProducts.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    <img
                      src={getProductImagePath(product.name)}
                      alt={product.name}
                      onError={(e) => {
                        console.log('Product image failed to load:', e.target.src);
                        e.target.onerror = null;
                        e.target.src = getProductImagePath('Urban Combat');
                      }}
                      loading="lazy"
                    />
                  </div>
                  <h3>{product.name}</h3>
                  <div className="product-price">
                    <span className="price-label">Wholesale Price:</span>
                    <span className="price-value">${product.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))
            ) : (
              // No products found
              <div className="no-products-message">
                <p>No featured products available at the moment.</p>
              </div>
            )}
          </div>

          <div className="view-all-container">
            <Link to="/products" className="btn btn-outline">
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
                      src={category.image || getCategoryImagePath(category.name)}
                      alt={`${category.name} Shoes`}
                      onError={(e) => {
                        console.log('Category image failed to load:', e.target.src);
                        e.target.onerror = null;
                        e.target.src = getCategoryImagePath('Casual');
                      }}
                      loading="lazy"
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
