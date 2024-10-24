// src/components/PromotionBanner.js
import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import Banner from '../assets/banner.png';

const PromotionBanner = () => {
  return (
    <Box
      p={4}
      bg="white"
      boxShadow="sm"
      borderRadius="md"
      my={4}
      maxW={['350px', '600px']}
      mx="auto"
    >
      <Text fontFamily={'Pretendard'} fontSize="lg" mb={4} fontWeight="bold">
        당신을 위한 추천 상품
      </Text>
      <Image
        src={Banner}
        borderRadius="md"
        alt="Promotion Banner"
        objectFit="cover"
        width="100%"
        height="auto"
      />
    </Box>
  );
};

export default PromotionBanner;
