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

const products = [
  {
    id: 1,
    image: 'https://via.placeholder.com/200x200.png?text=Product1',
    title: 'Casual Summer Dress',
    price: '29.99',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/200x200.png?text=Product2',
    title: 'Denim Jacket',
    price: '49.99',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/200x200.png?text=Product3',
    title: 'Classic White Sneakers',
    price: '39.99',
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/200x200.png?text=Product4',
    title: 'Leather Handbag',
    price: '59.99',
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/200x200.png?text=Product5',
    title: 'Silk Blouse',
    price: '34.99',
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/200x200.png?text=Product6',
    title: 'Formal Black Pants',
    price: '44.99',
  },
];

const ProductCard = ({ id, image, title, price }) => {
  const toast = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, image, title, price });
    toast({
      title: '장바구니에 담겼습니다',
      description: `${title}이(가) 장바구니에 추가되었습니다.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
      containerStyle: {
        marginTop: '80px', // 헤더와 겹치지 않도록 상단 마진 추가
      },
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" paddingTop="100%">
        <Image
          src={image}
          alt={title}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box p="3" flex="1" display="flex" flexDirection="column">
        <VStack spacing={2} align="stretch" flex="1">
          <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
            {title}
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            ${price}
          </Text>
          <Button
            size="sm"
            colorScheme="red"
            onClick={handleAddToCart}
            mt="auto"
          >
            Add to Cart
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const ProductGrid = () => (
  <Grid
    templateColumns={{
      base: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
    }}
    gap={4}
    p={4}
    w="100%"
  >
    {products.map((product) => (
      <GridItem key={product.id}>
        <ProductCard {...product} />
      </GridItem>
    ))}
  </Grid>
);

export default ProductGrid;
