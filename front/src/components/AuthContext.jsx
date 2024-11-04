// src/components/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // axiosInstance import
import { useNavigate } from 'react-router-dom';

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
      return response.data;
    } catch (error) {
      let errorMessage = '로그인 중 문제가 발생했습니다.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = '아이디 또는 비밀번호가 잘못되었습니다.';
        } else if (error.response.status === 400) {
          errorMessage = '입력값을 확인해주세요.';
        } else if (error.response.status === 404) {
          errorMessage =
            '로그인 URL을 찾을 수 없습니다. 서버 설정을 확인하세요.';
        }
      } else {
        errorMessage = '서버에 연결할 수 없습니다.';
      }

      throw new Error(errorMessage);
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
      setUser(null);
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
      setUser(null);
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
  if (!context)
    throw new Error('useAuth는 AuthProvider 내부에서만 사용 가능합니다.');
  return context;
};
