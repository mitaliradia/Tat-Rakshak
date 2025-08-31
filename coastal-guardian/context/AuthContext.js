"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on app start
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const isAuth = authService.isAuthenticated();
      
      if (isAuth && storedUser) {
        // Verify token is still valid
        const result = await authService.getCurrentUser();
        if (result.success) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    const result = await authService.login(credentials);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    return result;
  };

  const register = async (userData) => {
    setLoading(true);
    const result = await authService.register(userData);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAuthority = () => {
    return user?.role === 'authority';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAuthority,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
