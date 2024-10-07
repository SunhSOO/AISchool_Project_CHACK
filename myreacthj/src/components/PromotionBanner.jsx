// src/components/PromotionBanner.js
import React from 'react';
import { Box, Image, Text, HStack, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const PromotionBanner = () => {
  return (
    <Box p={4} bg="white" boxShadow="sm" borderRadius="md" my={4}>
      <Text fontFamily={'Pretendard'} fontSize="lg" mb={4} fontWeight="bold">
        당신을 위한 추천 상품
      </Text>
      <HStack
        overflowX="auto" // 가로 스크롤 활성화
        spacing={4}
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
        <IconButton
          icon={<ChevronLeftIcon />}
          size="sm"
          variant="ghost"
          aria-label="Previous"
        />
        <Image
          src="https://via.placeholder.com/200x100?text=Promotion+1"
          borderRadius="md"
        />
        <Image
          src="https://via.placeholder.com/200x100?text=Promotion+2"
          borderRadius="md"
        />
        <Image
          src="https://via.placeholder.com/200x100?text=Promotion+3"
          borderRadius="md"
        />
        <IconButton
          icon={<ChevronRightIcon />}
          size="sm"
          variant="ghost"
          aria-label="Next"
        />
      </HStack>
    </Box>
  );
};

export default PromotionBanner;
