import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockOrders = [
          { 
            id: 'ORD123456', 
            customer: 'John Doe', 
            email: 'john@example.com',
            date: '2023-05-15', 
            total: 459.99, 
            status: 'Delivered',
            items: 5
          },
          { 
            id: 'ORD123455', 
            customer: 'Jane Smith', 
            email: 'jane@example.com',
            date: '2023-05-14', 
            total: 239.98, 
            status: 'Processing',
            items: 3
          },
          { 
            id: 'ORD123454', 
            customer: 'Bob Johnson', 
            email: 'bob@example.com',
            date: '2023-05-13', 
            total: 129.99, 
            status: 'Shipped',
            items: 2
          },
          { 
            id: 'ORD123453', 
            customer: 'Alice Brown', 
            email: 'alice@example.com',
            date: '2023-05-12', 
            total: 349.97, 
            status: 'Delivered',
            items: 4
          },
          { 
            id: 'ORD123452', 
            customer: 'Charlie Wilson', 
            email: 'charlie@example.com',
            date: '2023-05-11', 
            total: 199.99, 
            status: 'Delivered',
            items: 2
          },
          { 
            id: 'ORD123451', 
            customer: 'Eva Martinez', 
            email: 'eva@example.com',
            date: '2023-05-10', 
            total: 89.99, 
            status: 'Cancelled',
            items: 1
          },
          { 
            id: 'ORD123450', 
            customer: 'David Lee', 
            email: 'david@example.com',
            date: '2023-05-09', 
            total: 299.97, 
            status: 'Delivered',
            items: 3
          },
          { 
            id: 'ORD123449', 
            customer: 'Grace Kim', 
            email: 'grace@example.com',
            date: '2023-05-08', 
            total: 159.98, 
            status: 'Processing',
            items: 2
          }
        ];
        
        setOrders(mockOrders);
        setTotalPages(2); // Mock pagination
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, statusFilter, dateFilter]);

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    // Simple date filter for demo
    const matchesDate = dateFilter ? order.date.includes(dateFilter) : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle date filter change
  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-page-header">
          <h1>Orders Management</h1>
        </div>
        <div className="admin-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <h1>Orders Management</h1>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search orders by ID, customer, or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <input
            type="text"
            placeholder="Filter by date (YYYY-MM-DD)"
            value={dateFilter}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div>{order.customer}</div>
                    <div className="email-small">{order.email}</div>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.items}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <select 
                      className={`status-select ${getStatusClass(order.status)}`}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/orders/${order.id}`} className="action-btn view-btn">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No orders found</td>
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

export default AdminOrdersPage;
