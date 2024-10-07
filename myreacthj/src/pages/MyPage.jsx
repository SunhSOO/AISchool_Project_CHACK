// src/pages/MyPage.js
import React from 'react';
import {
  Box,
  VStack,
  Avatar,
  Text,
  Heading,
  Divider,
  Button,
  HStack,
} from '@chakra-ui/react';

const MyPage = () => {
  return (
    <Box
      maxWidth="600px"
      margin="auto"
      p={4}
      bg="white"
      minHeight="100vh"
      fontFamily={'Pretendard'}
      mt={20}
    >
      {/* 프로필 섹션 */}
      <VStack spacing={4} align="center" mb={6}>
        <Avatar size="xl" name="이현준" src="https://via.placeholder.com/150" />
        <Heading as="h2" size="md">
          이현준
        </Heading>
        <Text color="gray.500">이메일@example.com</Text>
      </VStack>

      <Divider />

      {/* 내 정보 섹션 */}
      <Box mt={6}>
        <Heading as="h3" size="sm" mb={2}>
          내 정보
        </Heading>
        <VStack spacing={4} align="start">
          <Text>닉네임: 이현준</Text>
          <Text>이메일: 이메일@example.com</Text>
          <Button size="sm" colorScheme="red">
            정보 수정
          </Button>
        </VStack>
      </Box>

      <Divider my={6} />

      {/* 주문 내역 섹션 */}
      <Box>
        <Heading as="h3" size="sm" mb={2}>
          주문 내역
        </Heading>
        <Text color="gray.500">주문 내역이 없습니다.</Text>
      </Box>

      <Divider my={6} />

      {/* 설정 섹션 */}
      <Box>
        <Heading as="h3" size="sm" mb={2}>
          설정
        </Heading>
        <HStack spacing={4} mt={4}>
          <Button size="sm" colorScheme="red" variant="outline">
            로그아웃
          </Button>
          <Button size="sm" colorScheme="gray" variant="outline">
            계정 탈퇴
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default MyPage;
