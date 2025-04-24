import React, { useState, useEffect } from 'react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockCategories = [
          { id: 'CAT001', name: 'Athletic', description: 'Sports and athletic footwear', productCount: 15 },
          { id: 'CAT002', name: 'Casual', description: 'Everyday casual shoes', productCount: 22 },
          { id: 'CAT003', name: 'Formal', description: 'Business and formal occasions', productCount: 10 },
          { id: 'CAT004', name: 'Boots', description: 'All types of boots', productCount: 18 },
          { id: 'CAT005', name: 'Sandals', description: 'Summer and beach footwear', productCount: 12 },
          { id: 'CAT006', name: 'Kids', description: 'Children\'s footwear', productCount: 20 }
        ];
        
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle edit button click
  const handleEditClick = (category) => {
    setEditingCategory({ ...category });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingCategory.name.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  // Handle delete category
  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  // Handle input change for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory({ ...editingCategory, [name]: value });
  };

  // Handle input change for new category
  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Handle add new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    const newCategoryWithId = {
      id: `CAT${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...newCategory,
      productCount: 0
    };

    setCategories([...categories, newCategoryWithId]);
    setNewCategory({ name: '', description: '' });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="admin-categories-page">
        <div className="admin-page-header">
          <h1>Categories Management</h1>
        </div>
        <div className="admin-loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="admin-categories-page">
      <div className="admin-page-header">
        <h1>Categories Management</h1>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-card">
          <h2>Add New Category</h2>
          <div className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                placeholder="Enter category name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleNewCategoryChange}
                placeholder="Enter category description"
                rows="3"
              ></textarea>
            </div>
            <div className="form-actions">
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  {editingCategory && editingCategory.id === category.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editingCategory.name}
                      onChange={handleEditInputChange}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>
                  {editingCategory && editingCategory.id === category.id ? (
                    <textarea
                      name="description"
                      value={editingCategory.description}
                      onChange={handleEditInputChange}
                      rows="2"
                    ></textarea>
                  ) : (
                    category.description
                  )}
                </td>
                <td>{category.productCount}</td>
                <td className="actions-cell">
                  {editingCategory && editingCategory.id === category.id ? (
                    <>
                      <button 
                        className="action-btn save-btn"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                      <button 
                        className="action-btn cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.productCount > 0}
                        title={category.productCount > 0 ? "Cannot delete category with products" : ""}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="no-results">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
