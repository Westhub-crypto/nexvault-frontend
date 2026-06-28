import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'https://nexvault-api.onrender.com/api';

// Set base URL globally
axios.defaults.baseURL = API;
axios.defaults.withCredentials = false;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('nexvault_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`);
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    const { token: newToken, user: userData, isAdmin } = data;
    localStorage.setItem('nexvault_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return { isAdmin, user: userData };
  };

  const register = async (formData) => {
    const { data } = await axios.post(`${API}/auth/register`, formData);
    const { token: newToken, user: userData } = data;
    localStorage.setItem('nexvault_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('nexvault_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => fetchMe();

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
        
