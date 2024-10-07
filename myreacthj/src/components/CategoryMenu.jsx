// src/components/CategoryMenu.js
import React from 'react';
import { HStack, Box, Image, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import pantsImage from '../assets/pants.jpg';
import topsImage from '../assets/category-tops.jpg';
import dressesImage from '../assets/category-dresses.jpg';
import shirtImage from '../assets/category-shirts.jpg';
import shoesImage from '../assets/category-shoes.jpg';

// 카테고리 이미지 및 텍스트 정보 배열
const categories = [
  {
    name: 'Pants',
    image: pantsImage,
  },
  {
    name: 'Tops',
    image: topsImage,
  },
  {
    name: 'Dresses',
    image: dressesImage,
  },
  {
    name: 'Shirt',
    image: shirtImage,
  },
  {
    name: 'Shoes',
    image: shoesImage,
  },
];

const CategoryMenu = () => {
  return (
    <Box p={4} bg="white" boxShadow="sm" borderRadius="lg" mt={4}>
      {/* "Categories" 텍스트 추가 */}
      <Text
        fontFamily={'Pretendard'}
        fontSize="2xl"
        fontWeight="bold"
        textAlign="left"
        mb={4}
      >
        카테고리
      </Text>

      {/* 카테고리 HStack */}
      <HStack
        overflowX="auto" // 가로 스크롤 적용
        spacing={4}
        p={4}
        bg="white"
        boxShadow="sm"
        maxW="container.md"
        w="100%"
        mx="auto"
        mb={6}
        borderRadius="lg"
        css={{
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            as={RouterLink}
            to={`/category/${category.name.toLowerCase()}`}
            textAlign="center"
            flexShrink="0"
            minW="120px"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {/* 카테고리 이미지를 감싸는 Box */}
            <Box
              width="100px"
              height="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Image
                src={category.image}
                alt={category.name}
                boxSize="100px"
                borderRadius="md"
                objectFit="cover"
              />
            </Box>
            {/* 카테고리 이름 */}
            <Text fontSize="sm" fontWeight="medium">
              {category.name}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default CategoryMenu;
