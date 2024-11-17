// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { CartProvider } from './components/CartContext'; // 경로 확인
import { AuthProvider } from './components/AuthContext'; // 경로 확인
import { UserMeasurementProvider } from './contexts/UserMeasurementContext'; // 경로 확인
import { ClothingProvider } from './contexts/ClothingContext'; // ClothingProvider 임포트
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import AgreementPage from './pages/AgreementPage';
import ShoppingPage from './pages/ShoppingPage';
import UserLooks from './pages/UserLooks';
import SignupComponent from './pages/SignupComponent';
import MyPage from './pages/MyPage';
import LooksGallery from './pages/LooksGallery';
import AvatarViewer from './components/AvatarViewer'; // Avatar 컴포넌트 대신 AvatarViewer 임포트
import MeasurementForm from './components/MeasurementForm';
import Login from './pages/Login';
import CheckoutPage from './pages/CheckoutPage';
import CameraUpload from './components/CameraUpload';
import SizeCheck from './pages/SizeCheck';

const AppLayout = ({ children }) => {
  const location = useLocation();

  // 헤더/푸터를 제외할 페이지 목록에 새로운 경로들 추가
  const isExcludedPage =
    location.pathname === '/' ||
    location.pathname === '/agreement' ||
    location.pathname === '/signup' ||
    location.pathname === '/login';

  return (
    <>
      {!isExcludedPage && <Header />}
      <Box
        minH="100vh"
        pt={!isExcludedPage ? '20px' : '0'}
        pb={!isExcludedPage ? '20px' : '0'}
        maxW="600px"
        width="100%"
        mx="auto"
        bg={location.pathname === '/camera-upload' ? 'gray.100' : 'white'}
      >
        {children}
      </Box>
      {!isExcludedPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <UserMeasurementProvider>
            <ClothingProvider>
              {' '}
              {/* ClothingProvider 직접 포함 */}
              <CartProvider>
                <AppLayout>
                  <Routes>
                    {/* 인증 관련 라우트 */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/agreement" element={<AgreementPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignupComponent />} />
                    {/* 메인 페이지 라우트 */}
                    <Route path="/home" element={<Home />} />
                    {/* 아바타 생성 플로우 라우트 */}
                    <Route path="/camera-upload" element={<CameraUpload />} />
                    <Route
                      path="/measurement-form"
                      element={<MeasurementForm />}
                    />
                    <Route path="/sizecheck" element={<SizeCheck />} />
                    <Route path="/avatar" element={<AvatarViewer />} />{' '}
                    {/* Avatar 대신 AvatarViewer로 변경 */}
                    {/* 쇼핑 관련 라우트 */}
                    <Route path="/shopping" element={<ShoppingPage />} />
                    <Route
                      path="/category/:categoryName"
                      element={<CategoryPage />}
                    />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    {/* 사용자 스타일 관련 라우트 */}
                    <Route path="/UserLooks" element={<UserLooks />} />
                    <Route path="/looksgallery" element={<LooksGallery />} />
                    {/* 사용자 설정 라우트 */}
                    <Route path="/mypage" element={<MyPage />} />
                    {/* 404 페이지 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </CartProvider>
            </ClothingProvider>
          </UserMeasurementProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
