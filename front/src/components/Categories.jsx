// Categories.jsx
import React from 'react';
import { Box, Container, HStack, Button } from '@chakra-ui/react';

const categories = ['Dresses', 'Pants', 'Skirts', 'Shorts', 'Jackets'];

const Categories = () => (
  <Box p={4}>
    <Container maxW="100%" overflowX="auto" whiteSpace="nowrap" px={0}>
      <HStack spacing={2} justifyContent="space-between">
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
