import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Activity, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BarChart2,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-4 py-3 ${
      isActive 
        ? 'text-danger-600 bg-danger-50 border-r-4 border-danger-600' 
        : 'text-gray-600 hover:bg-gray-100'
    } transition-colors`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside 
        className={`bg-white shadow-md fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <NavLink to="/" className="flex items-center text-xl font-bold text-danger-600">
            <Shield className="mr-2" />
            <span>Admin Panel</span>
          </NavLink>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center text-danger-600 font-bold text-xl mr-3">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="font-medium text-gray-800">{user?.displayName || 'Admin'}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink to="/admin" end className={navLinkClasses} onClick={closeSidebar}>
            <Activity size={20} className="mr-3" />
            Overview
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClasses} onClick={closeSidebar}>
            <Users size={20} className="mr-3" />
            Users
          </NavLink>
          <NavLink to="/admin/activities" className={navLinkClasses} onClick={closeSidebar}>
            <Activity size={20} className="mr-3" />
            User Activities
          </NavLink>
          <NavLink to="/admin/settings" className={navLinkClasses} onClick={closeSidebar}>
            <Settings size={20} className="mr-3" />
            Settings
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClasses} onClick={closeSidebar}>
            <Home size={20} className="mr-3" />
            Dashboard
          </NavLink>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 w-full text-left transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <button 
            className="text-gray-500 hover:text-gray-700 lg:hidden mr-3"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <Shield size={20} className="text-danger-600 mr-2" />
            <h1 className="text-xl font-medium text-gray-800">Admin Panel</h1>
          </div>
          <div className="ml-auto flex items-center">
            <div className="relative">
              <div className="flex items-center cursor-pointer">
                <span className="text-sm font-medium text-gray-700 mr-1">{user?.displayName}</span>
                <div className="w-8 h-8 rounded-full bg-danger-100 flex items-center justify-center text-danger-600 font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;