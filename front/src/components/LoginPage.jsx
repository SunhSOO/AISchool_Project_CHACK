// src/pages/LoginPage.js
import React from 'react';
import { Box, Button, Text, Image, VStack, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import loginBackground from '../assets/loginback.jpg';
import logoImage from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleKakaoLogin = () => {
    navigate('/agreement'); // 회원가입 동의 페이지로 이동
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
    >
      <Box textAlign="center" color="white">
        <VStack spacing={4} mb={8}>
          <Image
            src={logoImage}
            alt="Chack 로고"
            boxSize="100px"
            objectFit="contain"
            mx="auto"
          />
          <Text fontSize="2xl" fontWeight="bold">
            완벽한 사이즈, <br />
            완벽한 핏
          </Text>
        </VStack>

        <Button
          bg="yellow.400"
          color="black"
          width="100%"
          maxW="sm"
          leftIcon={<Text as="span">💬</Text>}
          _hover={{ bg: 'yellow.500' }}
          mb={4}
          onClick={handleKakaoLogin}
        >
          카카오톡으로 시작하기
        </Button>
      </Box>
    </Flex>
  );
};

export default LoginPage;
