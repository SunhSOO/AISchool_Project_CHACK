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
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  const login = async (loginData) => {
    try {
      const response = await axiosInstance.post('/users/log-in', loginData);
      const accessToken = response.data.access_token;

      // 토큰 저장 및 헤더에 추가
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;

      await fetchUserData(); // 사용자 정보 가져오기
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data with token:', token); // 토큰 확인
      const response = await axiosInstance.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User data fetched from server:', response.data); // 사용자 데이터 확인
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false); // 로딩 완료
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
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false); // 토큰이 없을 때도 로딩 종료
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
