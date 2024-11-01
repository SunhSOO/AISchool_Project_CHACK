// Categories.jsx
import React from 'react';
import { Box, Container, HStack, Button } from '@chakra-ui/react';

const categories = ['Pants', 'Tops', 'Dresses', 'Shirts', 'Shoes'];

const Categories = () => (
  <Box p={4}>
    <Container
      overflowX="auto" // 수평 스크롤 허용
      px={0}
    >
      <HStack spacing={2} justifyContent="center">
        {' '}
        {/* 버튼을 중앙 정렬 */}
        {categories.map((category) => (
          <Button key={category} size="sm" variant="ghost" flexShrink={0}>
            {category}
          </Button>
        ))}
      </HStack>
    </Container>
  </Box>
);

export default Categories;
