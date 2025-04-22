import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductAPI } from '../services/api';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get filter values from URL params or defaults
  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const sort = searchParams.get('sort') || 'name_asc';

  useEffect(() => {
    // Fetch categories for filter dropdown
    const fetchCategories = async () => {
      try {
        // Direct fetch instead of using the API service
        const response = await fetch('/api/categories');
        const responseData = await response.json();
        console.log('Categories API response:', responseData);

        if (responseData.success && responseData.data) {
          setCategories(responseData.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Use default categories if API fails
        setCategories([
          { _id: 'athletic', name: 'Athletic' },
          { _id: 'casual', name: 'Casual' },
          { _id: 'formal', name: 'Formal' },
          { _id: 'boots', name: 'Boots' }
        ]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch products based on filters
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching products with filters:', { category, gender, sort });

        // Build params object for API call
        const params = {};
        if (category) params.category = category;

        // Handle gender filter - need to filter on the client side since gender is in specifications.gender
        // We'll filter the results after getting them from the API

        // Handle sorting
        if (sort) {
          const [field, direction] = sort.split('_');
          params.sortBy = field;
          params.sortDirection = direction;
        }

        console.log('API request params:', params);

        // Direct fetch instead of using the API service
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`/api/products?${queryString}`);
        const responseData = await response.json();
        console.log('Direct API response:', responseData);

        if (responseData && responseData.success && Array.isArray(responseData.data)) {
          // Transform API data to match our expected format
          let formattedProducts = responseData.data.map(product => ({
            id: product._id,
            name: product.name,
            price: product.basePrice,
            image: product.images && product.images.length > 0
              ? product.images[0]
              : '/images/product-placeholder.svg',
            category: product.category?.name || 'Unknown',
            gender: product.specifications?.gender || 'unisex'
          }));

          console.log('Formatted products before gender filter:', formattedProducts.length);

          // Apply gender filter on client side if specified
          if (gender) {
            formattedProducts = formattedProducts.filter(product =>
              product.gender.toLowerCase() === gender.toLowerCase()
            );
            console.log('Products after gender filter:', formattedProducts.length);
          }

          setProducts(formattedProducts);

          if (formattedProducts.length === 0) {
            console.log('No products match the current filters');
          }
        } else {
          // If no products returned or invalid response, use sample data
          console.log('Invalid API response, using sample data');
          setProducts(getSampleProducts());
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        // Use sample data as fallback
        setProducts(getSampleProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender, sort]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Update search params
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }

    setSearchParams(newParams);
  };

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

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Our Products</h2>

        <div className="products-container">
          <div className="filters-sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <label htmlFor="categoryFilter">Category</label>
              <select
                id="categoryFilter"
                name="category"
                value={category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="genderFilter">Gender</label>
              <select
                id="genderFilter"
                name="gender"
                value={gender}
                onChange={handleFilterChange}
              >
                <option value="">All Genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sortBy">Sort By</label>
              <select
                id="sortBy"
                name="sort"
                value={sort}
                onChange={handleFilterChange}
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="products-main">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <div className="product-grid" id="productsGrid">
              {loading ? (
                // Show skeleton loading state
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="product-card skeleton"></div>
                ))
              ) : products.length > 0 ? (
                // Show products with staggered animation
                products.map((product, index) => (
                  <div key={product.id} className="stagger-item">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                // No products found
                <div className="no-products-message">
                  <p>No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsPage;
