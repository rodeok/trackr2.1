import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/protected';

// Landing Pages
import Home from './pages/landing/Home';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Expenses from './pages/dashboard/Expenses';
import Reports from './pages/dashboard/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UserActivities from './pages/admin/UserActivities';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Pages */}
          <Route path="/" element={<Home />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard Routes (Protected) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
          </Route>

          {/* Admin Routes (Protected + Admin Required) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="activities" element={<UserActivities />} />
            <Route path="settings" element={<div>Admin Settings (Coming Soon)</div>} />
          </Route>

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;