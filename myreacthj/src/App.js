// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
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
import Avatar from './pages/Avater'; // Avatar 페이지 컴포넌트 가져오기

const AppLayout = ({ children }) => {
  const location = useLocation();

  // 로그인 페이지, 동의 페이지, 회원가입 페이지에서는 헤더와 푸터를 렌더링하지 않음
  const isExcludedPage =
    location.pathname === '/' ||
    location.pathname === '/agreement' ||
    location.pathname === '/signup';

  return (
    <>
      {!isExcludedPage && <Header />}
      {/* 헤더는 로그인, 동의, 회원가입 페이지에서 제외 */}

      <Box
        minH="100vh"
        pt={!isExcludedPage ? '20px' : '0'}
        pb={!isExcludedPage ? '20px' : '0'}
        maxW="600px"
        width="100%"
        mx="auto"
      >
        {children}
      </Box>

      {!isExcludedPage && <Footer />}
      {/* 푸터는 로그인, 동의, 회원가입 페이지에서 제외 */}
    </>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* 로그인 페이지 */}
            <Route path="/" element={<LoginPage />} />
            {/* 동의 페이지 */}
            <Route path="/agreement" element={<AgreementPage />} />
            {/* 홈 페이지 */}
            <Route path="/home" element={<Home />} />
            {/* 쇼핑 페이지 경로 */}
            <Route path="/ShoppingPage" element={<ShoppingPage />} />
            {/* 카테고리 페이지 */}
            <Route path="/category/:category" element={<CategoryPage />} />
            {/* UserLooks 페이지 경로 추가 */}
            <Route path="/UserLooks" element={<UserLooks />} />
            {/* 회원가입 경로 */}
            <Route path="/signup" element={<SignupComponent />} />
            {/* 404 페이지 경로 */}
            <Route path="*" element={<NotFound />} />
            {/* 갤러리 경로 */}
            <Route path="/looksgallery" element={<LooksGallery />} />
            {/* MyPage 경로 */}
            <Route path="/mypage" element={<MyPage />} />
            {/* Avatar 페이지 경로 */}
            <Route path="/avatar" element={<Avatar />} />
          </Routes>
        </AppLayout>
      </Router>
    </ChakraProvider>
  );
};

export default App;
