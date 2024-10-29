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
import axios from 'axios';

// axios 기본 설정
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 토큰이 있으면 자동으로 홈으로 리다이렉트
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
      navigate('/home');
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

      console.log('Sending login data:', loginData);

      const response = await axiosInstance.post('/users/log-in', loginData);

      console.log('Login response:', response);

      if (response.data && response.data.access_token) {
        // 토큰 저장
        localStorage.setItem('token', response.data.access_token);

        // 토큰을 헤더에 추가
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.access_token}`;

        try {
          // 사용자 정보 가져오기
          const userResponse = await axiosInstance.get('/users/me');
          if (userResponse.data) {
            localStorage.setItem('user_id', userResponse.data.user_id);
            localStorage.setItem('user_name', userResponse.data.user_name);
            localStorage.setItem('user_email', userResponse.data.user_email);
          }
        } catch (userError) {
          console.error('사용자 정보 가져오기 실패:', userError);
        }

        toast({
          title: '로그인 성공!',
          description: '홈페이지로 이동합니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = '로그인 중 문제가 발생했습니다.';
      if (error.response) {
        // 서버에서 응답이 왔지만 에러가 있는 경우
        errorMessage = error.response.data?.detail || errorMessage;

        // 특정 상태 코드에 따른 메시지 처리
        if (error.response.status === 401) {
          errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.response.status === 400) {
          errorMessage = '입력값을 확인해주세요.';
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
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

  // Form validation
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
