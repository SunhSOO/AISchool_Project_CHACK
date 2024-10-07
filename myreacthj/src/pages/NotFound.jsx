// src/pages/NotFound.js
import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box pt="60px" pb="60px" textAlign="center" fontFamily={'Pretendard'}>
      <Text fontSize="4xl" fontWeight="bold">
        404
      </Text>
      <Text mb={4}>페이지를 찾을 수 없습니다.</Text>
      <Button as={RouterLink} to="/home" colorScheme="red">
        홈으로 돌아가기
      </Button>
    </Box>
  );
};

export default NotFound;
