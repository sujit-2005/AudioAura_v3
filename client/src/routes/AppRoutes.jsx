import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage';
import AdminCouponsPage from '../pages/admin/AdminCouponsPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminInventoryPage from '../pages/admin/AdminInventoryPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/checkout/CheckoutPage';
import HomePage from '../pages/home/HomePage';
import OrderHistoryPage from '../pages/orders/OrderHistoryPage';
import ProductDetailsPage from '../pages/products/ProductDetailsPage';
import ProductListingPage from '../pages/products/ProductListingPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductListingPage />} />
    <Route path="/products/:slug" element={<ProductDetailsPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute>
          <OrderHistoryPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/dashboard"
      element={
        <ProtectedRoute adminOnly>
          <AdminDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route path="/adm/login" element={<AdminLoginPage />} />
    <Route path="/adm" element={<Navigate to="/adm/dashboard" replace />} />
    <Route path="/admin" element={<Navigate to="/adm/dashboard" replace />} />
    <Route
      path="/adm/products"
      element={
        <ProtectedRoute adminOnly>
          <AdminProductsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/inventory"
      element={
        <ProtectedRoute adminOnly>
          <AdminInventoryPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/orders"
      element={
        <ProtectedRoute adminOnly>
          <AdminOrdersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/customers"
      element={
        <ProtectedRoute adminOnly>
          <AdminCustomersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/reviews"
      element={
        <ProtectedRoute adminOnly>
          <AdminReviewsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/coupons"
      element={
        <ProtectedRoute adminOnly>
          <AdminCouponsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/reports"
      element={
        <ProtectedRoute adminOnly>
          <AdminReportsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/adm/settings"
      element={
        <ProtectedRoute adminOnly>
          <AdminSettingsPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
