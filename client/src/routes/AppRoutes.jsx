import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';

// Import all the pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import VerifyOtpPage from '../pages/VerifyOtpPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import SuppliersPage from '../pages/SuppliersPage.jsx';
import CategoriesPage from '../pages/CategoriesPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx'; // Import the new page

const AppRoutes = () => (
    <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Protected Routes Wrapper */}
        <Route
            path="/*"
            element={
                <ProtectedRoute>
                    <Layout>
                        <Routes>
                            {/* Nested Protected Routes */}
                            <Route index element={<DashboardPage />} />
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="suppliers" element={<SuppliersPage />} />
                            <Route path="categories" element={<CategoriesPage />} />
                            
                            {/* Catch-all for any other protected routes */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                </ProtectedRoute>
            }
        />
        
        {/* Catch-all for any top-level routes that don't match */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default AppRoutes;

