import React from 'react';
import { Box, VStack, IconButton, Text, HStack } from '@chakra-ui/react';
import { ShoppingCart } from 'lucide-react';
import MainImage from '../components/MainImage';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../components/CartContext';

const ShoppingPage = () => {
  const { cartItems } = useCart();

  return (
    <Box
      maxWidth="600px"
      margin="0 auto"
      bg="white"
      display="flex"
      flexDirection="column"
      pt="50px"
      pb="50px"
      position="relative"
    >
      <HStack position="absolute" top="10px" right="10px" spacing={2}>
        <Text fontSize="sm" color="gray.600">
          {cartItems.length} items
        </Text>
        <IconButton
          icon={<ShoppingCart size={20} />}
          aria-label="Shopping Cart"
          colorScheme="blue"
          variant="ghost"
          size="md"
          borderRadius="full"
          as="a"
          href="/cart" // 장바구니 페이지로 이동
        />
      </HStack>
      <VStack spacing={4} align="stretch" flexGrow={1}>
        <MainImage />
        <Categories />
        <ProductGrid />
      </VStack>
    </Box>
  );
};

export default ShoppingPage;
