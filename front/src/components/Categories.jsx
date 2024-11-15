import React from 'react';
import { Box, HStack, Button, Text, VStack, Flex } from '@chakra-ui/react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { useClothing } from './ClothingContext';

const categories = ['All', 'T-shirt', 'Shirt', 'Pants', 'Skirt'];

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const { gender, setGender } = useClothing();

  return (
    <Box p={4} borderRadius="3xl" width="100%">
      <VStack spacing={4} width="100%">
        {/* 성별 선택 */}
        <Flex width="100%" justifyContent="center" gap={8}>
          <Box
            position="relative"
            cursor="pointer"
            onClick={() => setGender('male')}
          >
            <Flex
              alignItems="center"
              gap={2}
              px={4}
              color={gender === 'male' ? 'black' : 'gray.500'}
            >
              <FaMale />
              <Text fontWeight="medium">MALE</Text>
            </Flex>
            {gender === 'male' && (
              <Box
                position="absolute"
                bottom="-2px"
                left="0"
                right="0"
                height="2px"
                bg="black"
              />
            )}
          </Box>
          <Box
            position="relative"
            cursor="pointer"
            onClick={() => setGender('female')}
          >
            <Flex
              alignItems="center"
              gap={2}
              px={4}
              color={gender === 'female' ? 'black' : 'gray.500'}
            >
              <FaFemale />
              <Text fontWeight="medium">FEMALE</Text>
            </Flex>
            {gender === 'female' && (
              <Box
                position="absolute"
                bottom="-2px"
                left="0"
                right="0"
                height="2px"
                bg="black"
              />
            )}
          </Box>
        </Flex>

        {/* 카테고리 선택 버튼 */}
        <HStack spacing={2} justifyContent="space-between" w="100%">
          {categories.map((category) => (
            <Button
              key={category}
              borderRadius="3xl"
              size="sm"
              bg={selectedCategory === category ? 'black' : 'transparent'}
              color={selectedCategory === category ? 'white' : 'black'}
              _hover={{
                bg: selectedCategory === category ? 'gray.800' : 'gray.100',
              }}
              width="100%"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default Categories;
