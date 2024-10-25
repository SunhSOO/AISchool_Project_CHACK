import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  IconButton,
  Flex,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';

const Login = () => {
  const [userId, setUserId] = useState(''); // 아이디 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const toast = useToast(); // 알림 메시지 표시를 위한 Chakra UI 훅
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 로그인 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FastAPI 백엔드로 로그인 요청 보내기
      const response = await axios.post('http://localhost:8000/users/log-in', {
        user_id: userId, // 아이디 필드 추가
        password: password,
      });

        toast({
          title: '로그인 성공!',
          description: '홈페이지로 이동합니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/home'); // 성공 시 홈 페이지로 이동
      
    } catch (error) {
      console.error('로그인 오류:', error);
      toast({
        title: '로그인 실패',
        description:
          error.response?.data?.detail || '로그인 중 문제가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <Box position="relative" minHeight="100vh" fontFamily="Pretendard">
      {/* 뒤로가기 버튼 */}
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
                {/* 사용자 아이디 입력 */}
                <FormControl isRequired>
                  <FormLabel>아이디</FormLabel>
                  <Input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                  />
                </FormControl>
                {/* 비밀번호 입력 */}
                <FormControl isRequired>
                  <FormLabel>비밀번호</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                  />
                </FormControl>
                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  colorScheme="red"
                  width="full"
                  isLoading={isLoading}
                >
                  로그인
                </Button>
              </VStack>
            </form>
            <Text textAlign="center">
              계정이 없으신가요?{' '}
              <Link color="blue.500" href="/signup">
                회원가입
              </Link>
            </Text>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};

export default Login;
