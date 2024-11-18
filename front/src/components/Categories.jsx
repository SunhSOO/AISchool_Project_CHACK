import React from 'react';
import { Box, HStack, Button, Text, VStack, Flex } from '@chakra-ui/react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { useClothing } from '../contexts/ClothingContext';

const categories = ['All', 'T-shirt', 'Shirt', 'Pants', 'Skirt'];

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const { activeClothing } = useClothing();
  const { gender } = activeClothing; // activeClothing에서 gender를 가져옵니다

  console.log('Current gender:', gender); // 로그로 확인

  return (
    <Box p={4} width="100%">
      <VStack spacing={4} width="100%">
        {/* 성별 표시 */}
        <Flex width="100%" justifyContent="center" gap={8}>
          {/* Male */}
          <Box p={4}>
            <Flex alignItems="center" gap={2}>
              <FaMale color={gender === 'male' ? 'black' : 'gray.500'} />
              <Text
                fontWeight="medium"
                color={gender === 'male' ? 'black' : 'gray.500'}
              >
                MALE
              </Text>
            </Flex>
          </Box>

          {/* Female */}
          <Box p={4}>
            <Flex alignItems="center" gap={2}>
              <FaFemale color={gender === 'female' ? 'black' : 'gray.500'} />
              <Text
                fontWeight="medium"
                color={gender === 'female' ? 'black' : 'gray.500'}
              >
                FEMALE
              </Text>
            </Flex>
          </Box>
        </Flex>

        {/* 카테고리 선택 버튼 */}
        <HStack spacing={2} justifyContent="space-between" w="100%">
          {categories.map((category) => {
            const isDisabled = gender === 'male' && category === 'Skirt';
            return (
              <Button
                key={category}
                borderRadius="3xl"
                size="sm"
                bg={selectedCategory === category ? 'black' : 'transparent'}
                color={
                  isDisabled
                    ? 'gray.400'
                    : selectedCategory === category
                    ? 'white'
                    : 'black'
                }
                _hover={{
                  bg: isDisabled
                    ? 'transparent'
                    : selectedCategory === category
                    ? 'gray.800'
                    : 'gray.100',
                }}
                width="100%"
                isDisabled={isDisabled}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            );
          })}
        </HStack>
      </VStack>
    </Box>
  );
};

export default Categories;
