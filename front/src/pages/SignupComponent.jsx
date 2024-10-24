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
import axios from 'axios'; // Axios 사용하여 HTTP 요청

const SignupComponent = () => {
  const [username, setUsername] = useState(''); // 사용자 이름 상태 관리
  const [email, setEmail] = useState(''); // 이메일 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const toast = useToast(); // 알림 메시지 표시를 위한 Chakra UI 훅
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 회원가입 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FastAPI 백엔드로 회원가입 요청 보내기
      const response = await axios.post('http://localhost:8000/users/sign-up', {
        user_id: username,
        user_name: username, // FastAPI에서 기대하는 필드 이름과 일치
        user_email: email,
        password: password,
      });

      // 서버 응답이 정상적일 때 처리
      if (response && response.data) {
        console.log(response.data); // 서버 응답 확인
        toast({
          title: '계정이 생성되었습니다.',
          description: '회원가입에 성공했습니다!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/home'); // 성공 시 홈 페이지로 이동
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error('회원가입 오류:', error);
      toast({
        title: '회원가입 실패',
        description:
          error.response?.data?.detail || '회원가입 중 문제가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <Box position="relative" minHeight="100vh" fontFamily={'Pretendard'}>
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
              Chack 서비스 가입
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {/* 사용자 이름 입력 */}
                <FormControl isRequired>
                  <FormLabel>사용자 이름</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="사용자 이름을 입력하세요"
                  />
                </FormControl>
                {/* 이메일 입력 */}
                <FormControl isRequired>
                  <FormLabel>이메일</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
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
                {/* 가입하기 버튼 */}
                <Button
                  type="submit"
                  colorScheme="red"
                  width="full"
                  isLoading={isLoading}
                >
                  가입하기
                </Button>
              </VStack>
            </form>
            <Text textAlign="center">
              이미 계정이 있으신가요?{' '}
              <Link color="blue.500" href="/login">
                로그인
              </Link>
            </Text>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};

export default SignupComponent;
