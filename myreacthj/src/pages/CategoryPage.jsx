// src/pages/CategoryPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';

const CategoryPage = () => {
  const { category } = useParams();

  return (
    <Box
      pt="60px"
      pb="60px"
      maxW="container.md"
      mx="auto"
      fontFamily={'Pretendard'}
    >
      <Text fontSize="2xl" fontWeight="bold">
        {category} 페이지
      </Text>
      <Text>이곳에서 {category} 관련 상품을 확인하세요.</Text>
    </Box>
  );
};

export default CategoryPage;
