// src/pages/Home.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import Banner from '../components/Banner';
import CategoryMenu from '../components/CategoryMenu';
import PromotionBanner from '../components/PromotionBanner';

const Home = () => {
  return (
    <Box pt="60px" pb="60px" maxW="container.md" mx="auto">
      <CategoryMenu />
      <Banner />
      <PromotionBanner />
    </Box>
  );
};

export default Home;
