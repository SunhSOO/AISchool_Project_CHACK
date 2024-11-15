import React, { useState, useEffect } from 'react';
import {
  Grid,
  GridItem,
  Box,
  Image,
  Text,
  Button,
  VStack,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { useCart } from './CartContext';
import { useClothing } from './ClothingContext';
import axiosInstance from '../api/axiosInstance'; // 변경된 부분

const ProductCard = ({
  clo_idx,
  clo_img1_url,
  clo_name,
  clo_price,
  clo_desc,
  clo_3d,
}) => {
  const toast = useToast();
  const { addToCart } = useCart();
  const { wearClothing, removeClothing } = useClothing();
  const [isWearing, setIsWearing] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      clo_idx,
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
    });
  };

  const handleTryOn = () => {
    if (!clo_desc) {
      console.warn('No type available for:', clo_name);
      toast({
        title: '의상 착용 실패',
        description: '의상 유형이 지정되지 않았습니다.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (isWearing) {
      // 이미 착용 중이면 제거
      removeClothing(clo_desc);
      setIsWearing(false);
      toast({
        title: '의상 제거',
        description: `${clo_name}을(를) 제거했습니다.`,
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } else {
      // 새로 착용
      wearClothing(clo_desc, clo_3d);
      setIsWearing(true);
      toast({
        title: '의상 착용',
        description: `${clo_name}을(를) 착용합니다.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      height="100%"
      shadow="sm"
    >
      <Box position="relative" paddingTop="100%">
        <Image
          src={clo_img1_url}
          alt={clo_name}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box p="2">
        <VStack spacing={1} align="stretch">
          <Text fontWeight="medium" fontSize="xs" noOfLines={1}>
            {clo_name}
          </Text>
          <Text fontSize="xs" fontWeight="bold" color="gray.800">
            ₩{parseInt(clo_price).toLocaleString()}
          </Text>
          <HStack spacing={1}>
            <Button
              size="xs"
              colorScheme={isWearing ? 'red' : 'blue'}
              borderRadius="lg"
              flex="1"
              onClick={handleTryOn}
            >
              {isWearing ? '제거하기' : '입어보기'}
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              borderRadius="lg"
              flex="1"
              onClick={handleAddToCart}
            >
              담기
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

const ProductGrid = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const { gender } = useClothing();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          'https://chack.ngrok.dev/clothes/'
        ); // 변경된 부분
        console.log('API Response:', response.data);
        let filteredProducts = response.data.clothes;

        // 카테고리 필터링
        if (selectedCategory !== 'All') {
          filteredProducts = filteredProducts.filter((product) => {
            const type = product.clo_desc?.toLowerCase();
            switch (selectedCategory) {
              case 'T-shirt':
                return type === 't-shirt';
              case 'Shirt':
                return type === 'shirt';
              case 'Pants':
                return type === 'pants' || type === 'short-pants';
              case 'Skirt':
                return type === 'skirt';
              default:
                return true;
            }
          });
        }

        // 성별에 따른 필터링
        filteredProducts = filteredProducts.filter((product) => {
          if (gender === 'male') {
            return !product.clo_desc?.toLowerCase().includes('skirt');
          }
          return true;
        });

        console.log('Filtered products:', filteredProducts);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategory, gender]);

  return (
    <Box
      p={2}
      height="100%"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {products.map((product) => (
          <GridItem key={product.clo_idx}>
            <ProductCard
              clo_idx={product.clo_idx}
              clo_img1_url={product.clo_img1_url}
              clo_name={product.clo_name}
              clo_price={product.clo_price}
              clo_desc={product.clo_desc}
              clo_3d={product.clo_3d}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
