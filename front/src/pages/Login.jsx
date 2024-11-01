// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
  IconButton,
  Flex,
  Container,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home'); // 이미 로그인된 경우 홈으로 이동
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginData = {
        user_id: userId,
        password: password,
      };

      await login(loginData); // AuthContext의 login 함수 호출

      toast({
        title: '로그인 성공!',
        description: '홈페이지로 이동합니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = '로그인 중 문제가 발생했습니다.';
      if (error.response) {
        errorMessage = error.response.data?.detail || errorMessage;

        if (error.response.status === 401) {
          errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.response.status === 400) {
          errorMessage = '입력값을 확인해주세요.';
        }
      } else if (error.request) {
        errorMessage = '서버에 연결할 수 없습니다.';
      }

      toast({
        title: '로그인 실패',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = userId.trim() !== '' && password.trim() !== '';

  return (
    <Box position="relative" minHeight="100vh" fontFamily="Pretendard">
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="뒤로가기"
        variant="ghost"
        position="absolute"
        top={4}
        left={2}
        onClick={() => navigate(-1)}
      />
      <Flex direction="column" minHeight="100vh" justify="center">
        <Container maxW="400px">
          <VStack spacing={6} align="stretch">
            <Heading as="h1" size="2xl" textAlign="left">
              로그인
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>아이디</FormLabel>
                  <Input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    autoComplete="username"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>비밀번호</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="red"
                  width="full"
                  isLoading={isLoading}
                  isDisabled={!isFormValid}
                  loadingText="로그인 중..."
                >
                  로그인
                </Button>
              </VStack>
            </form>
            <Text textAlign="center">
              계정이 없으신가요?{' '}
              <ChakraLink as={RouterLink} to="/signup" color="blue.500">
                회원가입
              </ChakraLink>
            </Text>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};

export default Login;
