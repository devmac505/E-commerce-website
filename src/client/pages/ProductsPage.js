import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductAPI } from '../services/api';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filtersSidebarRef = useRef(null);

  // Get filter values from URL params or defaults
  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const brand = searchParams.get('brand') || '';
  const color = searchParams.get('color') || '';
  const material = searchParams.get('material') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name_asc';

  useEffect(() => {
    // Fetch categories for filter dropdown
    const fetchCategories = async () => {
      try {
        // Use the API service instead of direct fetch
        const responseData = await ProductAPI.getCategories();
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

    // Fetch brands for filter dropdown
    const fetchBrands = async () => {
      try {
        // This would ideally be a separate API endpoint
        // For now, we'll use sample data
        setBrands([
          { _id: 'nike', name: 'Nike' },
          { _id: 'adidas', name: 'Adidas' },
          { _id: 'puma', name: 'Puma' },
          { _id: 'reebok', name: 'Reebok' },
          { _id: 'newbalance', name: 'New Balance' },
          { _id: 'converse', name: 'Converse' }
        ]);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };

    // Fetch colors for filter dropdown
    const fetchColors = async () => {
      try {
        // This would ideally be a separate API endpoint
        // For now, we'll use sample data
        setColors([
          { _id: 'black', name: 'Black' },
          { _id: 'white', name: 'White' },
          { _id: 'red', name: 'Red' },
          { _id: 'blue', name: 'Blue' },
          { _id: 'green', name: 'Green' },
          { _id: 'brown', name: 'Brown' },
          { _id: 'gray', name: 'Gray' }
        ]);
      } catch (err) {
        console.error('Error fetching colors:', err);
      }
    };

    // Fetch materials for filter dropdown
    const fetchMaterials = async () => {
      try {
        // This would ideally be a separate API endpoint
        // For now, we'll use sample data
        setMaterials([
          { _id: 'leather', name: 'Leather' },
          { _id: 'canvas', name: 'Canvas' },
          { _id: 'synthetic', name: 'Synthetic' },
          { _id: 'mesh', name: 'Mesh' },
          { _id: 'suede', name: 'Suede' }
        ]);
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    };

    // Fetch all filter options
    fetchCategories();
    fetchBrands();
    fetchColors();
    fetchMaterials();
  }, []);

  useEffect(() => {
    // Fetch products based on filters
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching products with filters:', {
          category, gender, brand, color, material, minPrice, maxPrice, inStock, search, sort
        });

        // Build params object for API call
        const params = {};
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (color) params.color = color;
        if (material) params.material = material;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (inStock === 'true') params.inStock = 'true';
        if (search) params.search = search;

        // Handle gender filter - need to filter on the client side since gender is in specifications.gender
        // We'll filter the results after getting them from the API

        // Handle sorting
        if (sort) {
          const [field, direction] = sort.split('_');
          params.sortBy = field;
          params.sortDirection = direction;
        }

        console.log('API request params:', params);

        // Use the API service instead of direct fetch
        const responseData = await ProductAPI.getProducts(params);
        console.log('API response:', responseData);

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
            brand: product.brand || 'Unknown',
            color: product.specifications?.color || 'Unknown',
            material: product.specifications?.material || 'Unknown',
            gender: product.specifications?.gender || 'unisex',
            inStock: product.inventory > 0
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
  }, [category, gender, brand, color, material, minPrice, maxPrice, inStock, search, sort]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update search params
    const newParams = new URLSearchParams(searchParams);

    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      if (checked) {
        newParams.set(name, 'true');
      } else {
        newParams.delete(name);
      }
    } else {
      if (value) {
        newParams.set(name, value);
      } else {
        newParams.delete(name);
      }
    }

    setSearchParams(newParams);
  };

  // Handle search input
  const handleSearchInput = (e) => {
    if (e.key === 'Enter') {
      const searchValue = e.target.value.trim();
      const newParams = new URLSearchParams(searchParams);

      if (searchValue) {
        newParams.set('search', searchValue);
      } else {
        newParams.delete('search');
      }

      setSearchParams(newParams);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
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
        gender: 'unisex',
        brand: 'Nike',
        color: 'Black',
        material: 'Mesh',
        inStock: true
      },
      {
        id: 'sample2',
        name: 'Casual Leather Loafers',
        price: 59.99,
        image: '/images/products/loafers.jpg',
        category: 'Casual',
        gender: 'men',
        brand: 'Adidas',
        color: 'Brown',
        material: 'Leather',
        inStock: true
      },
      {
        id: 'sample3',
        name: 'Formal Business Oxfords',
        price: 89.99,
        image: '/images/products/oxfords.jpg',
        category: 'Formal',
        gender: 'men',
        brand: 'Puma',
        color: 'Black',
        material: 'Leather',
        inStock: false
      },
      {
        id: 'sample4',
        name: 'Women\'s Fashion Boots',
        price: 99.99,
        image: '/images/products/boots.jpg',
        category: 'Boots',
        gender: 'women',
        brand: 'Reebok',
        color: 'Brown',
        material: 'Suede',
        inStock: true
      }
    ];
  };

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Our Products</h2>

        {/* Mobile filter toggle button */}
        <button
          className="mobile-filter-toggle"
          onClick={toggleMobileFilters}
        >
          <i className="fas fa-filter"></i> Filter Products
        </button>

        <div className="products-container">
          {/* Filters sidebar */}
          <div className={`filters-sidebar ${mobileFiltersOpen ? 'active' : ''}`} ref={filtersSidebarRef}>
            {/* Mobile close button */}
            {mobileFiltersOpen && (
              <button className="filter-close" onClick={toggleMobileFilters}>
                <i className="fas fa-times"></i>
              </button>
            )}

            <h3>Filters</h3>

            {/* Search filter */}
            <div className="filter-search">
              <input
                type="text"
                placeholder="Search products..."
                defaultValue={search}
                onKeyDown={handleSearchInput}
              />
              <span className="search-icon">
                <i className="fas fa-search"></i>
              </span>
            </div>

            {/* Category filter */}
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

            {/* Brand filter */}
            <div className="filter-group">
              <label htmlFor="brandFilter">Brand</label>
              <select
                id="brandFilter"
                name="brand"
                value={brand}
                onChange={handleFilterChange}
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender filter */}
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

            {/* Color filter */}
            <div className="filter-group">
              <label htmlFor="colorFilter">Color</label>
              <select
                id="colorFilter"
                name="color"
                value={color}
                onChange={handleFilterChange}
              >
                <option value="">All Colors</option>
                {colors.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Material filter */}
            <div className="filter-group">
              <label htmlFor="materialFilter">Material</label>
              <select
                id="materialFilter"
                name="material"
                value={material}
                onChange={handleFilterChange}
              >
                <option value="">All Materials</option>
                {materials.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range filter */}
            <div className="filter-group">
              <label htmlFor="priceFilter">Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  placeholder="Min"
                  value={minPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>

            {/* In stock filter */}
            <div className="filter-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="inStockFilter"
                  name="inStock"
                  checked={inStock === 'true'}
                  onChange={handleFilterChange}
                />
                <label htmlFor="inStockFilter">In Stock Only</label>
              </div>
            </div>

            {/* Sort by filter */}
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
                <option value="popularity_desc">Popularity</option>
                <option value="newest_desc">Newest First</option>
              </select>
            </div>

            {/* Filter actions */}
            <div className="filter-actions">
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          </div>

          {/* Products main content */}
          <div className="products-main">
            {/* Active filters display */}
            {(category || brand || gender || color || material || minPrice || maxPrice || inStock || search) && (
              <div className="filter-tags">
                {category && (
                  <span className="filter-tag">
                    Category: {categories.find(c => c._id === category)?.name || category}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('category');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {brand && (
                  <span className="filter-tag">
                    Brand: {brands.find(b => b._id === brand)?.name || brand}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('brand');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {gender && (
                  <span className="filter-tag">
                    Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('gender');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {color && (
                  <span className="filter-tag">
                    Color: {colors.find(c => c._id === color)?.name || color}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('color');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {material && (
                  <span className="filter-tag">
                    Material: {materials.find(m => m._id === material)?.name || material}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('material');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="filter-tag">
                    Price: {minPrice ? `$${minPrice}` : '$0'} - {maxPrice ? `$${maxPrice}` : 'Any'}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('minPrice');
                      newParams.delete('maxPrice');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {inStock === 'true' && (
                  <span className="filter-tag">
                    In Stock Only
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('inStock');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
                {search && (
                  <span className="filter-tag">
                    Search: {search}
                    <span className="remove-tag" onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('search');
                      setSearchParams(newParams);
                    }}>×</span>
                  </span>
                )}
              </div>
            )}

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
                products.map((product) => (
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
