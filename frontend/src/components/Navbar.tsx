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
    <nav className='bg-gradient-to-r from-emerald-400 to-teal-500 shadow-xl backdrop-blur-sm bg-opacity-95'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center space-x-6'>
            <Link to='/' className='text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2'>
            
              <span>VehicleHub</span>
            </Link>
            <div className='hidden md:flex items-center space-x-6'>
              <Link
                to='/'
                className='text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 font-medium'
              >
                Browse Vehicles
              </Link>
              {isAuthenticated && isAdmin && (
                <Link
                  to='/admin'
                  className='text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 font-medium flex items-center space-x-1'
                >
                  
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                <div className='hidden md:flex items-center space-x-2 text-white/90'>
                  <span className='text-sm'>👋</span>
                  <span className='font-medium'>Welcome, {currentUser?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className='bg-white text-green-600 hover:bg-gray-50 px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2'
              >
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;