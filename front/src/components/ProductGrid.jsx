// src/components/ProductGrid.jsx

import React, { useState, useEffect } from 'react';
import { Grid, GridItem, Box, useToast } from '@chakra-ui/react';
import { ProductCard } from './ProductCard'; // 이름 있는 내보내기로 가져오기
import { useClothing } from '../contexts/ClothingContext';
import axiosInstance from '../api/axiosInstance';
import { debugLog, clearLogs } from '../utils/logging';

/**
 * ProductGrid 컴포넌트
 * 기본(default) 내보내기로 유지
 */
const ProductGrid = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const {
    activeClothing: { gender },
  } = useClothing();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/clothes');
        debugLog('api-response', 'API Response:', response.data);
        let filteredProducts = response.data.clothes;

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

        filteredProducts = filteredProducts.filter((product) => {
          if (gender === 'male') {
            return !product.clo_desc?.toLowerCase().includes('skirt');
          }
          return true;
        });

        debugLog('filtered-products', 'Filtered products:', filteredProducts);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      }
    };

    fetchProducts();

    return () => {
      clearLogs(); // 컴포넌트 언마운트 시 로그 초기화
    };
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
              clo_mtl={product.clo_mtl}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;
