import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, BarChart2, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Check if user is on landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isLandingPage
      ? 'bg-white dark:bg-gray-900 shadow-md py-3'
      : 'bg-transparent py-5'
  }`;

  const textClasses = isScrolled || !isLandingPage
    ? 'text-gray-800 dark:text-white'
    : 'text-white';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className={navbarClasses}>
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className={`text-2xl font-bold flex items-center transition-colors ${textClasses}`}
        >
          <BarChart2 className="mr-2" />
          <span>TRACKR</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="space-x-6">
            <Link 
              to="/" 
              className={`${textClasses} hover:text-primary-500 transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`${textClasses} hover:text-primary-500 transition-colors`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`${textClasses} hover:text-primary-500 transition-colors`}
            >
              Pricing
            </Link>
          </div>

          {!user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className={`${textClasses} hover:text-primary-500 transition-colors`}
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="relative group">
              <button className={`flex items-center ${textClasses} hover:text-primary-500 transition-colors`}>
                <span className="mr-1">{user.displayName || 'User'}</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div className="py-2">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <BarChart2 size={16} className="mr-2" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Shield size={16} className="mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden ${textClasses}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 absolute top-full left-0 right-0 shadow-lg animate-fadeIn">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <Link 
              to="/" 
              className="py-2 text-gray-800 dark:text-white hover:text-primary-500"
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="py-2 text-gray-800 dark:text-white hover:text-primary-500"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="py-2 text-gray-800 dark:text-white hover:text-primary-500"
            >
              Pricing
            </Link>
            
            {!user ? (
              <div className="flex flex-col mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  to="/login" 
                  className="py-2 text-gray-800 dark:text-white hover:text-primary-500"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="mt-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-center transition-all"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  to="/dashboard" 
                  className="flex items-center py-2 text-gray-800 dark:text-white hover:text-primary-500"
                >
                  <BarChart2 size={16} className="mr-2" />
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center py-2 text-gray-800 dark:text-white hover:text-primary-500"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center py-2 text-gray-800 dark:text-white hover:text-primary-500"
                  >
                    <Shield size={16} className="mr-2" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-2 text-gray-800 dark:text-white hover:text-primary-500"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;