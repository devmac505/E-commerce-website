import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAuthState } from '../../services/authState';

const AdminSidebar = () => {
  const { userName } = getAuthState();

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-user">
          <div className="admin-avatar">
            <span>{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="admin-user-info">
            <p className="admin-user-name">{userName}</p>
            <p className="admin-user-role">Administrator</p>
          </div>
        </div>
      </div>
      <nav className="admin-nav">
        <ul>
          <li>
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="dashboard-icon">📊</i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="products-icon">👟</i>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="categories-icon">📁</i>
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="orders-icon">📦</i>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="users-icon">👥</i>
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <NavLink to="/" className="back-to-site">
          <i className="site-icon">🏠</i>
          Back to Website
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
