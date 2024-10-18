// ShoppingPage.jsx
import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import MainImage from '../components/MainImage';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';

const ShoppingPage = () => {
  return (
    <Box
      maxWidth="600px"
      // height="100vh"
      margin="0 auto"
      bg="white"
      display="flex"
      flexDirection="column"
      // overflow="hidden"
      pt="50px"
      pb="50px"
    >
      <VStack spacing={4} align="stretch" flexGrow={1}>
        {/* <VStack spacing={4} align="stretch" flexGrow={1} overflowY="hidden"> */}
        <MainImage />
        <Categories />
        <ProductGrid />
      </VStack>
    </Box>
  );
};

export default ShoppingPage;
