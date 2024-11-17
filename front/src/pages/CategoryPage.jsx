import React, { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { ClothingProvider } from '../contexts/ClothingContext';
import Categories from '../components/Categories';
import AvatarViewer from '../components/AvatarViewer';
import ProductGrid from '../components/ProductGrid';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(
    categoryName || 'All'
  );

  return (
    <ClothingProvider>
      <VStack
        spacing={4}
        width="100%"
        maxW="600px"
        mx="auto"
        px={4}
        pb={12}
        pt="50px"
      >
        {/* 상단 카테고리 */}
        <Box width="100%">
          <Categories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Box>

        {/* 제품 그리드 */}
        <Box
          width="100%"
          maxH="100%"
          borderRadius="2xl"
          boxShadow="base"
          bg="white"
          overflow="hidden"
        >
          <ProductGrid selectedCategory={selectedCategory} />
        </Box>
      </VStack>
    </ClothingProvider>
  );
};

export default CategoryPage;
