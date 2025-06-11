// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { loginUser as loginApi, registerUser as registerApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ferremaxUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    if (response.data.success) {
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('ferremaxUser', JSON.stringify(userData));
    }
    return response.data;
  };

  const register = async (userData) => {
    return await registerApi(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ferremaxUser');
  };

  const value = { user, login, register, logout, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};