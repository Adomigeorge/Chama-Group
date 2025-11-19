import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

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
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Verify token is still valid by fetching profile
        const response = await authService.getProfile();
        setUser(response.data.user);
      } catch (error) {
        // Token is invalid, clear storage
        authService.logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError('');
      const response = await authService.login(email, password);
      
      if (response.status === 'success') {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authService.register(userData);
      
      if (response.status === 'success') {
        // Auto-login after registration
        return await login(userData.email, userData.password);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError('');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};