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

const SignupComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: '계정이 생성되었습니다.',
      description: '회원가입에 성공했습니다!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsLoading(false);
    navigate('/home');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box position="relative" minHeight="100vh" fontFamily={'Pretendard'}>
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="뒤로가기"
        variant="ghost"
        position="absolute"
        top={4}
        left={2}
        onClick={handleBack}
      />
      <Flex direction="column" minHeight="100vh" justify="center">
        <Container maxW="400px">
          <VStack spacing={6} align="stretch">
            <Heading
              as="h1"
              size="2xl"
              textAlign="left"
              fontFamily={'Pretendard'}
            >
              Chack<br></br> 서비스 가입
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>사용자 이름</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="사용자 이름을 입력하세요"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>이메일</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>비밀번호</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                  />
                </FormControl>
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
