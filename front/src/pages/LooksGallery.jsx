// src/pages/LooksGallery.js
import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  IconButton,
  Image,
  HStack,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FaHeart, FaPlus } from 'react-icons/fa';

const sampleLooks = [
  { id: 1, imageUrl: 'https://via.placeholder.com/200', title: 'Look 1' },
  { id: 2, imageUrl: 'https://via.placeholder.com/200', title: 'Look 2' },
  { id: 3, imageUrl: 'https://via.placeholder.com/200', title: 'Look 3' },
  { id: 4, imageUrl: 'https://via.placeholder.com/200', title: 'Look 4' },
  { id: 5, imageUrl: 'https://via.placeholder.com/200', title: 'Look 5' },
  { id: 6, imageUrl: 'https://via.placeholder.com/200', title: 'Look 6' },
  { id: 7, imageUrl: 'https://via.placeholder.com/200', title: 'Look 7' },
  { id: 8, imageUrl: 'https://via.placeholder.com/200', title: 'Look 8' },
  { id: 9, imageUrl: 'https://via.placeholder.com/200', title: 'Look 9' },
];

const LooksGallery = () => {
  return (
    <Box maxW="1500px" mx="auto" p={4} mt={20} mb={20}>
      <HStack spacing={2} mb={4} justifyContent="left">
        <Button variant="outline">성별</Button>
        <Button variant="outline">유형</Button>
        <Button variant="outline">계절</Button>
        <Button variant="outline">스타일</Button>
        <Button variant="outline">키</Button>
        <Button variant="outline">몸무게</Button>
      </HStack>

      {/* 2개씩 배치된 룩 갤러리 */}
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {sampleLooks.map((look) => (
          <GridItem key={look.id} position="relative" overflow="hidden">
            <Image
              src={look.imageUrl}
              alt={look.title}
              borderRadius="md"
              objectFit="cover"
              width="100%"
              height="250px"
            />
            <IconButton
              icon={<FaHeart />}
              colorScheme="whiteAlpha"
              variant="ghost"
              position="absolute"
              bottom="10px"
              right="10px"
              fontSize="20px"
              color="white"
              _hover={{ color: 'red.500' }}
              aria-label="Like"
            />
          </GridItem>
        ))}
        <GridItem position="relative">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="gray.200"
            width="100%"
            height="250px"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'gray.300' }}
          >
            <Icon as={FaPlus} boxSize={10} color="gray.600" />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default LooksGallery;
