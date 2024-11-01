// src/pages/CategoryPage.jsx

import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  IconButton,
  Text,
  Badge,
  Image,
  Flex,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const CategoryPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // 기본값은 'All'

  // 확장된 예시 데이터 - 한글 카테고리 이름으로 구성
  const exampleProducts = [
    {
      id: '1',
      title: '예쁜 복숭아 머그',
      price: '₩20,000',
      imageUrl: 'https://via.placeholder.com/150/FFB6C1/000000?text=Mug',
      category: '머그컵',
    },
    {
      id: '2',
      title: '보온 컵',
      price: '₩45,000',
      imageUrl: 'https://via.placeholder.com/150/87CEFA/000000?text=Cup',
      category: '컵',
    },
    {
      id: '3',
      title: '보온 플라스크',
      price: '₩55,000',
      imageUrl: 'https://via.placeholder.com/150/3CB371/000000?text=Flask',
      category: '플라스크',
    },
    {
      id: '4',
      title: '캐주얼 바지',
      price: '₩35,000',
      imageUrl: 'https://via.placeholder.com/150/8A2BE2/000000?text=Pants',
      category: '바지',
    },
    {
      id: '5',
      title: '편안한 상의',
      price: '₩30,000',
      imageUrl: 'https://via.placeholder.com/150/FF69B4/000000?text=Top',
      category: '상의',
    },
    {
      id: '6',
      title: '우아한 드레스',
      price: '₩70,000',
      imageUrl: 'https://via.placeholder.com/150/FF6347/000000?text=Dress',
      category: '드레스',
    },
    {
      id: '7',
      title: '러닝화',
      price: '₩60,000',
      imageUrl: 'https://via.placeholder.com/150/4682B4/000000?text=Shoes',
      category: '신발',
    },
    {
      id: '8',
      title: '스타일리시 자켓',
      price: '₩90,000',
      imageUrl: 'https://via.placeholder.com/150/FFA07A/000000?text=Jacket',
      category: '자켓',
    },
    {
      id: '9',
      title: '코지 스웨터',
      price: '₩50,000',
      imageUrl: 'https://via.placeholder.com/150/FFD700/000000?text=Sweater',
      category: '상의',
    },
    {
      id: '10',
      title: '캐주얼 티셔츠',
      price: '₩25,000',
      imageUrl: 'https://via.placeholder.com/150/20B2AA/000000?text=T-shirt',
      category: '셔츠',
    },
  ];

  // 선택된 카테고리에 맞게 제품 필터링
  const filteredProducts =
    selectedCategory === 'All'
      ? exampleProducts
      : exampleProducts.filter(
          (product) => product.category === selectedCategory
        );

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(productId)
        ? prevFavorites.filter((id) => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  return (
    <Box p={4} maxW="container.lg" mx="auto" mt={12}>
      {/* 카테고리 선택 버튼 */}
      <Wrap spacing={4} mb={4} justify="center">
        {['All', '바지', '상의', '드레스', '셔츠', '신발'].map((category) => (
          <WrapItem key={category} flex="1">
            <Button
              onClick={() => setSelectedCategory(category)}
              colorScheme={selectedCategory === category ? 'red' : 'gray'}
              variant={selectedCategory === category ? 'solid' : 'outline'}
              width="100%" // 버튼이 전체 너비를 차지하도록 설정
            >
              {category}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      {/* 제품 목록 */}
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={6}
        mb={12}
      >
        {filteredProducts.map((product) => (
          <GridItem key={product.id}>
            <Box
              bg="gray.50"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="md"
              p={3}
            >
              <Image
                src={product.imageUrl}
                alt={product.title}
                objectFit="cover"
                w="100%"
                h="150px"
                borderRadius="md"
                mb={2}
              />
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold" fontSize="md">
                  {product.title}
                </Text>
                <IconButton
                  icon={
                    favorites.includes(product.id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )
                  }
                  onClick={() => toggleFavorite(product.id)}
                  variant="ghost"
                  aria-label="Add to favorites"
                />
              </Flex>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {product.price}
              </Text>
              <Badge colorScheme="blue" mt={1}>
                New
              </Badge>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryPage;
