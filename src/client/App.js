import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load page components with named chunks for better caching
const HomePage = lazy(() => import(/* webpackChunkName: "home" */ './pages/HomePage'));
const ProductsPage = lazy(() => import(/* webpackChunkName: "products" */ './pages/ProductsPage'));
const ProductDetailPage = lazy(() => import(/* webpackChunkName: "product-detail" */ './pages/ProductDetailPage'));
const CartPage = lazy(() => import(/* webpackChunkName: "cart" */ './pages/CartPage'));
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ './pages/LoginPage'));
const RegisterPage = lazy(() => import(/* webpackChunkName: "register" */ './pages/RegisterPage'));
const AboutPage = lazy(() => import(/* webpackChunkName: "about" */ './pages/AboutPage'));
const ContactPage = lazy(() => import(/* webpackChunkName: "contact" */ './pages/ContactPage'));

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Suspense fallback={<div className="page-loading"><LoadingSpinner /></div>}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<div className="not-found-page">Page not found</div>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
