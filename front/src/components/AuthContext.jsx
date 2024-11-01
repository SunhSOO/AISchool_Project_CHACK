// src/components/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (loginData) => {
    try {
      const response = await axiosInstance.post('/users/log-in', loginData);
      const accessToken = response.data.access_token;

      sessionStorage.setItem('token', accessToken);
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      await fetchUserData(accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchUserData = async (accessToken) => {
    try {
      const response = await axiosInstance.get('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUser(null); // 사용자 정보 가져오기 실패 시 user를 null로 설정
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
      setUser(null); // 토큰이 없을 때 user를 명시적으로 null로 설정
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
