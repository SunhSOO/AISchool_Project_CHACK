// src/pages/ShoppingPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, VStack, IconButton, Text, HStack } from '@chakra-ui/react';
import { ShoppingCart } from 'lucide-react';
import MainImage from '../components/MainImage';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../components/CartContext';
import axios from 'axios';

const ShoppingPage = () => {
  const { cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // 선택된 카테고리 상태 추가

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/clothes/');
        setProducts(response.data.clothes); // Assuming response.data.clothes is an array of product objects
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // 선택된 카테고리에 따라 필터링된 제품 목록
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.clo_desc === selectedCategory);

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
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ProductGrid products={filteredProducts} />{' '}
        {/* Filtered products passed to ProductGrid */}
      </VStack>
    </Box>
  );
};

export default ShoppingPage;
