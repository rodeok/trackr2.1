import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Home, 
  DollarSign, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
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
        ? 'text-primary-600 bg-primary-50 border-r-4 border-primary-600' 
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
          <NavLink to="/" className="flex items-center text-xl font-bold text-primary-600">
            <BarChart2 className="mr-2" />
            <span>ExpenseTracker</span>
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
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl mr-3">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-medium text-gray-800">{user?.displayName || 'User'}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink to="/dashboard" className={navLinkClasses} onClick={closeSidebar}>
            <Home size={20} className="mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/expenses" className={navLinkClasses} onClick={closeSidebar}>
            <DollarSign size={20} className="mr-3" />
            Expenses
          </NavLink>
          <NavLink to="/dashboard/reports" className={navLinkClasses} onClick={closeSidebar}>
            <PieChart size={20} className="mr-3" />
            Reports
          </NavLink>
          <NavLink to="/dashboard/settings" className={navLinkClasses} onClick={closeSidebar}>
            <Settings size={20} className="mr-3" />
            Settings
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClasses} onClick={closeSidebar}>
              <Shield size={20} className="mr-3" />
              Admin Panel
            </NavLink>
          )}
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
          <div className="ml-auto flex items-center">
            <div className="relative">
              <div className="flex items-center cursor-pointer">
                <span className="text-sm font-medium text-gray-700 mr-1">{user?.displayName}</span>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
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

export default DashboardLayout;