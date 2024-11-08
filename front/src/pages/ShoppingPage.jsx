// src/pages/ShoppingPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import MainImage from '../components/MainImage';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import axios from 'axios';

const ShoppingPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.21.54:8000/clothes/');
        setProducts(response.data.clothes);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

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
      <VStack spacing={4} align="stretch" flexGrow={1}>
        <MainImage />
        <Categories
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ProductGrid products={filteredProducts} />
      </VStack>
    </Box>
  );
};

export default ShoppingPage;
