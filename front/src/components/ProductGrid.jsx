// ProductGrid.jsx
import React from 'react';
import {
  Grid,
  GridItem,
  Box,
  Image,
  Text,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useCart } from './CartContext';

const ProductCard = ({ clo_idx, clo_img1_url, clo_name, clo_price }) => {
  const toast = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      clo_idx, // clo_idx를 전달합니다.
      clo_img1_url,
      clo_name,
      clo_price,
    });
    toast({
      title: '장바구니에 담겼습니다',
      description: `${clo_name}이(가) 장바구니에 추가되었습니다.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
      containerStyle: { marginTop: '80px' },
    });
  };

  return (
    <Box borderWidth="1px" borderRadius="3xl" overflow="hidden" bg="white">
      <Image
        src={clo_img1_url}
        alt={clo_name}
        objectFit="cover"
        width="100%"
        height="200px"
      />
      <Box p="3">
        <VStack spacing={2} align="stretch">
          <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
            {clo_name}
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            ₩{parseInt(clo_price).toLocaleString()}
          </Text>
          <Button
            size="sm"
            colorScheme="red"
            borderRadius="3xl"
            onClick={handleAddToCart}
          >
            장바구니에 추가
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const ProductGrid = ({ products = [] }) => (
  <Grid
    templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
    gap={4}
    p={4}
  >
    {products.map((product) => (
      <GridItem key={product.clo_idx}>
        <ProductCard {...product} />
      </GridItem>
    ))}
  </Grid>
);

export default ProductGrid;
