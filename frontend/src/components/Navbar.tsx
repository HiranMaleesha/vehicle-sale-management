import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      setIsAuthenticated(auth);
      setCurrentUser(user);
      setIsAdmin(user?.role === 'admin');
    };

    checkAuth();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <nav className='bg-white shadow-lg'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center space-x-4'>
            <Link to='/' className='text-2xl font-bold text-blue-600'>
              Vehicle Sales
            </Link>
            <Link to='/' className='text-gray-600 hover:text-blue-600'>
              Browse
            </Link>
            {isAuthenticated && isAdmin && (
              <Link
                to='/admin'
                className='text-gray-600 hover:text-blue-600'
              >
                Admin
              </Link>
            )}
          </div>
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                <span className='text-gray-600'>
                  Welcome, {currentUser?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;