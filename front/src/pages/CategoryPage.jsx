// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import axios from 'axios';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams(); // URL에서 카테고리 이름 가져오기
  const [selectedCategory, setSelectedCategory] = useState('');

  // 제품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.21.16:8000/clothes/');
        setProducts(response.data.clothes);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // URL 파라미터 변경 시 카테고리 업데이트
  useEffect(() => {
    setSelectedCategory(categoryName || 'All');
  }, [categoryName]);

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (product) =>
            product.clo_desc.toLowerCase() === selectedCategory.toLowerCase()
        );

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
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ProductGrid products={filteredProducts} />
    </Box>
  );
};

export default CategoryPage;
