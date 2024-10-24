// ProductCard.jsx
import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

const ProductCard = ({ image, title, price }) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
    <Image src={image} alt={title} />
    <Box p="2">
      <Text fontSize="sm" mt="1">
        {title}
      </Text>
      <Text fontWeight="bold">${price}</Text>
    </Box>
  </Box>
);

export default ProductCard;
