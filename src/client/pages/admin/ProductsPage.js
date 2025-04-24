import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProducts = [
          { id: 'PRD001', name: 'Athletic Running Shoes', price: 79.99, category: 'Athletic', stock: 25, isActive: true },
          { id: 'PRD002', name: 'Casual Leather Loafers', price: 59.99, category: 'Casual', stock: 18, isActive: true },
          { id: 'PRD003', name: 'Formal Business Oxfords', price: 89.99, category: 'Formal', stock: 12, isActive: true },
          { id: 'PRD004', name: 'Women\'s Fashion Boots', price: 99.99, category: 'Boots', stock: 8, isActive: true },
          { id: 'PRD005', name: 'Men\'s Hiking Boots', price: 129.99, category: 'Boots', stock: 15, isActive: true },
          { id: 'PRD006', name: 'Kids Sport Sneakers', price: 49.99, category: 'Athletic', stock: 30, isActive: true },
          { id: 'PRD007', name: 'Women\'s Casual Flats', price: 39.99, category: 'Casual', stock: 22, isActive: false },
          { id: 'PRD008', name: 'Men\'s Dress Shoes', price: 79.99, category: 'Formal', stock: 10, isActive: true },
          { id: 'PRD009', name: 'Unisex Canvas Shoes', price: 29.99, category: 'Casual', stock: 40, isActive: true },
          { id: 'PRD010', name: 'Women\'s High Heels', price: 69.99, category: 'Formal', stock: 15, isActive: true }
        ];
        
        setProducts(mockProducts);
        setTotalPages(2); // Mock pagination
        
        // Mock categories
        setCategories([
          { id: 'Athletic', name: 'Athletic' },
          { id: 'Casual', name: 'Casual' },
          { id: 'Formal', name: 'Formal' },
          { id: 'Boots', name: 'Boots' }
        ]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, sortField, sortDirection]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle product active status
  const toggleProductStatus = (id) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, isActive: !product.isActive } : product
    ));
  };

  if (loading) {
    return (
      <div className="admin-products-page">
        <div className="admin-page-header">
          <h1>Products Management</h1>
        </div>
        <div className="admin-loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <h1>Products Management</h1>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          Add New Product
        </Link>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th onClick={() => handleSortChange('name')} className="sortable">
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSortChange('price')} className="sortable">
                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Category</th>
              <th onClick={() => handleSortChange('stock')} className="sortable">
                Stock {sortField === 'stock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`status-badge ${product.isActive ? 'status-success' : 'status-danger'}`}
                      onClick={() => toggleProductStatus(product.id)}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/products/${product.id}`} className="action-btn edit-btn">
                      Edit
                    </Link>
                    <Link to={`/admin/products/${product.id}/inventory`} className="action-btn inventory-btn">
                      Inventory
                    </Link>
                    <button className="action-btn delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
