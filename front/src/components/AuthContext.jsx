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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (loginData) => {
    try {
      const response = await axiosInstance.post('/users/log-in', loginData);
      const accessToken = response.data.access_token;

      // 토큰 저장 및 상태 업데이트
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // 사용자 정보 가져오기 및 설정
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
      setUser(response.data); // 사용자 정보를 user 상태에 저장
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
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
