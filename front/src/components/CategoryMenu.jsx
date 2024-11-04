// src/pages/CategoryMenu.jsx

import React from 'react';
import { HStack, Box, Image, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import pantsImage from '../assets/pants.jpg';
import topsImage from '../assets/category-tops.jpg';
import dressesImage from '../assets/category-dresses.jpg';
import shirtImage from '../assets/category-shirts.jpg';
import shoesImage from '../assets/category-shoes.jpg';

const categories = [
  { name: 'Pants', image: pantsImage },
  { name: 'Tops', image: topsImage },
  { name: 'Dresses', image: dressesImage },
  { name: 'Outer', image: shirtImage },
  { name: 'Shoes', image: shoesImage },
];

const CategoryMenu = () => {
  return (
    <Box
      p={4}
      bg="white"
      boxShadow="sm"
      borderRadius="3xl"
      mt={4}
      maxW={{ base: '350px', md: '600px', lg: '800px' }}
      mx="auto"
    >
      <Text
        fontFamily={'Pretendard'}
        fontSize="2xl"
        fontWeight="bold"
        textAlign="left"
        mb={4}
      >
        카테고리
      </Text>

      <HStack
        overflowX="scroll"
        spacing={4}
        bg="white"
        maxW="full"
        mx="auto"
        mb={6}
        justifyContent="start"
        css={{
          '&::-webkit-scrollbar': { height: '8px' },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': { background: '#555' },
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            as={RouterLink}
            to={`/category/${category.name.toLowerCase()}`} // 클릭 시 해당 카테고리 페이지로 이동
            textAlign="center"
            flexShrink="0"
            minW="fit-content"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
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
                borderRadius="2xl"
                objectFit="cover"
              />
            </Box>
            <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
              {category.name}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default CategoryMenu;
