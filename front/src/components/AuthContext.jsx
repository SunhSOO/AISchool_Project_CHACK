import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // 토큰이 유효하지 않은 경우 로그아웃 처리
      if (error.response?.status === 403 || error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData) => {
    try {
      const response = await axiosInstance.post('/users/log-in', loginData);
      const { access_token } = response.data;

      // 토큰 저장
      localStorage.setItem('token', access_token);

      // 사용자 정보 가져오기
      await fetchUserData();

      return response.data;
    } catch (error) {
      let errorMessage = '로그인 중 문제가 발생했습니다.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = '아이디 또는 비밀번호가 잘못되었습니다.';
        } else if (error.response.status === 403) {
          errorMessage = '접근이 거부되었습니다.';
        }
      }

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
