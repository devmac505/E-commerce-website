import React, { useState, useEffect } from 'react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockUsers = [
          { 
            id: 'USR001', 
            name: 'John Doe', 
            email: 'john@example.com',
            role: 'admin',
            companyName: 'Admin Co.',
            phone: '123-456-7890',
            lastLogin: '2023-05-15',
            isActive: true
          },
          { 
            id: 'USR002', 
            name: 'Jane Smith', 
            email: 'jane@example.com',
            role: 'user',
            companyName: 'Retail Shop',
            phone: '234-567-8901',
            lastLogin: '2023-05-14',
            isActive: true
          },
          { 
            id: 'USR003', 
            name: 'Bob Johnson', 
            email: 'bob@example.com',
            role: 'user',
            companyName: 'Shoe Store',
            phone: '345-678-9012',
            lastLogin: '2023-05-10',
            isActive: true
          },
          { 
            id: 'USR004', 
            name: 'Alice Brown', 
            email: 'alice@example.com',
            role: 'user',
            companyName: 'Fashion Outlet',
            phone: '456-789-0123',
            lastLogin: '2023-05-08',
            isActive: false
          },
          { 
            id: 'USR005', 
            name: 'Charlie Wilson', 
            email: 'charlie@example.com',
            role: 'user',
            companyName: 'Footwear Inc.',
            phone: '567-890-1234',
            lastLogin: '2023-05-12',
            isActive: true
          },
          { 
            id: 'USR006', 
            name: 'Eva Martinez', 
            email: 'eva@example.com',
            role: 'admin',
            companyName: 'Admin Co.',
            phone: '678-901-2345',
            lastLogin: '2023-05-15',
            isActive: true
          },
          { 
            id: 'USR007', 
            name: 'David Lee', 
            email: 'david@example.com',
            role: 'user',
            companyName: 'Shoe Emporium',
            phone: '789-012-3456',
            lastLogin: '2023-05-01',
            isActive: false
          }
        ];
        
        setUsers(mockUsers);
        setTotalPages(2); // Mock pagination
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, roleFilter]);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle role filter change
  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle user active status
  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  // Change user role
  const changeUserRole = (id, newRole) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-page-header">
          <h1>Users Management</h1>
        </div>
        <div className="admin-loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <h1>Users Management</h1>
        <button className="admin-btn admin-btn-primary">
          Add New User
        </button>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name, email, or company..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={handleRoleChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.companyName}</td>
                  <td>
                    <select 
                      className={`role-select ${user.role === 'admin' ? 'admin-role' : 'user-role'}`}
                      value={user.role}
                      onChange={(e) => changeUserRole(user.id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className={`status-badge ${user.isActive ? 'status-success' : 'status-danger'}`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit-btn">
                      Edit
                    </button>
                    <button className="action-btn reset-btn">
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">No users found</td>
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

export default AdminUsersPage;
