import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Import admin pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminUsersPage from './pages/admin/UsersPage';

// Layout component for public routes
const PublicLayout = ({ children }) => (
  <>
    <Navigation />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
        <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
      </Routes>
    </div>
  );
}

export default App;
