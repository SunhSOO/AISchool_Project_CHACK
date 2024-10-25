// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { CartProvider } from '../src/components/CartContext'; // CartContext import 추가
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
import Avatar from './pages/Avater';
import MeasurementForm from './components/MeasurementForm';
import Login from './pages/Login';

const AppLayout = ({ children }) => {
  const location = useLocation();

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
      <CartProvider>
        {' '}
        {/* CartProvider 추가 */}
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/agreement" element={<AgreementPage />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/ShoppingPage" element={<ShoppingPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/UserLooks" element={<UserLooks />} />
              <Route path="/signup" element={<SignupComponent />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/looksgallery" element={<LooksGallery />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/avatar" element={<Avatar />} />
              <Route path="/measurement-form" element={<MeasurementForm />} />
            </Routes>
          </AppLayout>
        </Router>
      </CartProvider>
    </ChakraProvider>
  );
};

export default App;
