// src/components/Categories.jsx
import React from 'react';
import { Box, HStack, Button } from '@chakra-ui/react';

const categories = ['All', 'Pants', 'Tops', 'Dresses', 'Outer'];

const Categories = ({ selectedCategory, setSelectedCategory }) => (
  <Box p={4} borderRadius="3xl" width="100%">
    <HStack spacing={2} justifyContent="space-between" w="100%">
      {categories.map((category) => (
        <Button
          key={category}
          borderRadius="3xl"
          size="sm"
          variant={selectedCategory === category ? 'solid' : 'ghost'}
          width="100%"
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </Button>
      ))}
    </HStack>
  </Box>
);

export default Categories;
