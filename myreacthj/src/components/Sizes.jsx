// Sizes.jsx
import React from 'react';
import { Box, Container, HStack, Button } from '@chakra-ui/react';

const sizes = ['34', '36', '38', '40', '42', '44', '46'];

const Sizes = ({ selectedSize, onSizeClick }) => (
  <Box p={4}>
    <Container maxW="100%" overflowX="auto" whiteSpace="nowrap" px={0}>
      <HStack spacing={2} pb={2} justifyContent="space-between">
        {sizes.map((size) => (
          <Button
            key={size}
            px={4}
            py={2}
            borderRadius="full"
            flexShrink={0}
            variant={selectedSize === size ? 'solid' : 'outline'}
            colorScheme={selectedSize === size ? 'blue' : 'gray'}
            onClick={() => onSizeClick(size)}
          >
            {size}
          </Button>
        ))}
      </HStack>
    </Container>
  </Box>
);

export default Sizes;
