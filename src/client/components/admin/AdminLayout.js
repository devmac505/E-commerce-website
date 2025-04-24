import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { getAuthState } from '../../services/authState';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = getAuthState();

  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, userRole, navigate]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
