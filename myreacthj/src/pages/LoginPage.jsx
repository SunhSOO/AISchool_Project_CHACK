// src/pages/LoginPage.js
import React from 'react';
import {
  Box,
  Button,
  Text,
  Image,
  VStack,
  Link,
  Flex,
  keyframes,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import loginBackground from '../assets/loginback.jpg'; // 배경 이미지 불러오기
import logoImage from '../assets/logo.png'; // 로고 이미지 불러오기

// 배경 이미지를 X축과 Y축으로 부드럽게 이동시키는 keyframes 정의
const moveBackground = keyframes`
  0% { background-position: 0% 0%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
`;

const LoginPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleKakaoLogin = () => {
    navigate('/agreement'); // 회원가입 페이지로 이동
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgImage={`url(${loginBackground})`}
      bgSize="cover"
      bgPosition="0 0"
      p={4}
      sx={{
        animation: `${moveBackground} 30s ease-in-out infinite`, // 배경 애니메이션
      }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.7)"
        zIndex="1"
      />

      <Box
        position="relative"
        zIndex="2"
        textAlign="center"
        color="white"
        fontFamily={'Pretendard'}
      >
        <VStack spacing={4} align="center" mt="-40px" ml={5}>
          <Image
            src={logoImage}
            alt="Chack 로고"
            boxSize={['150px', '170px', '190px', '210px']}
            objectFit="contain"
            mx="auto"
            mb="300"
          />
        </VStack>

        <Text fontSize={['md', 'lg', 'xl']} fontWeight="light" mb={4}>
          완벽한 사이즈, 완벽한 핏
        </Text>

        {/* 회원가입 버튼 */}
        <Button
          bg="red.500"
          color="white"
          width="100%"
          maxW="sm"
          fontSize={['md', 'lg', 'xl']}
          leftIcon={<Text as="span">💬</Text>}
          _hover={{ bg: 'red.700' }}
          mb={4}
          onClick={handleKakaoLogin}
        >
          회원가입으로 시작하기
        </Button>

        <Text fontSize={['xs', 'sm']} fontWeight="light">
          또는,{' '}
          <Link href="#" textDecoration="underline">
            시작하지 않기
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default LoginPage;
