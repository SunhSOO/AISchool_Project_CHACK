// src/components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios instance 생성
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
  const [loading, setLoading] = useState(true); // loading 상태 추가
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

      // 사용자 정보 가져오기
      await fetchUserData();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true); // 로딩 시작
      const response = await axiosInstance.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      setLoading(false); // 토큰이 없는 경우에도 로딩 완료로 설정
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
