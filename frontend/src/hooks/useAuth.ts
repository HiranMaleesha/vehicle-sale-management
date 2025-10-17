import { useState, useEffect } from 'react';
import { authService } from '../services/api';

export const useAuth = () => {
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

    // Also listen for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return {
    isAuthenticated,
    currentUser,
    isAdmin,
    logout,
  };
};