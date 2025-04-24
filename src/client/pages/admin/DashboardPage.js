import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalProducts: 48,
          totalCategories: 6,
          totalOrders: 124,
          totalUsers: 85,
          recentOrders: [
            { id: 'ORD123456', customer: 'John Doe', date: '2023-05-15', total: 459.99, status: 'Delivered' },
            { id: 'ORD123455', customer: 'Jane Smith', date: '2023-05-14', total: 239.98, status: 'Processing' },
            { id: 'ORD123454', customer: 'Bob Johnson', date: '2023-05-13', total: 129.99, status: 'Shipped' },
            { id: 'ORD123453', customer: 'Alice Brown', date: '2023-05-12', total: 349.97, status: 'Delivered' },
            { id: 'ORD123452', customer: 'Charlie Wilson', date: '2023-05-11', total: 199.99, status: 'Delivered' }
          ],
          lowStockProducts: [
            { id: 'PRD001', name: 'Athletic Running Shoes', stock: 3, category: 'Athletic' },
            { id: 'PRD015', name: 'Casual Leather Loafers', stock: 5, category: 'Casual' },
            { id: 'PRD023', name: 'Formal Business Oxfords', stock: 2, category: 'Formal' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-success';
      case 'shipped':
        return 'status-info';
      case 'processing':
        return 'status-warning';
      case 'cancelled':
        return 'status-danger';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
        </div>
        <div className="admin-loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to your admin dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products-icon">👟</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <Link to="/admin/products" className="stat-link">View all products</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon categories-icon">📁</div>
          <div className="stat-content">
            <h3>Categories</h3>
            <p className="stat-value">{stats.totalCategories}</p>
            <Link to="/admin/categories" className="stat-link">View all categories</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon">📦</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">View all orders</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users-icon">👥</div>
          <div className="stat-content">
            <h3>Registered Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <Link to="/admin/users" className="stat-link">View all users</Link>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-sections">
        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="action-link">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <Link to="/admin/orders" className="view-all-link">View All Orders</Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Low Stock Products</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className="stock-badge low-stock">
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/products/${product.id}`} className="action-link">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <Link to="/admin/products" className="view-all-link">View All Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
