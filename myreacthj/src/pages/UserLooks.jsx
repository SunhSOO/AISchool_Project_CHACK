import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

// 샘플 데이터 (5개만 표시)
const initialLooks = [
  {
    id: 1,
    title: 'Beige chic winter',
    price: '459 TND',
    size: 'US 7',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    title: 'Party shiny red look',
    price: '339 TND',
    size: 'US 6',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    title: 'Denim stylish look',
    price: '299 TND',
    size: 'US 8',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    title: 'Black biker look',
    price: '399 TND',
    size: 'US 9',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 5,
    title: 'Casual blue summer',
    price: '259 TND',
    size: 'US 10',
    image: 'https://via.placeholder.com/150',
  },
];

const UserLooks = () => {
  const [looks] = useState(initialLooks.slice(0, 5)); // 초기 데이터 상태에서 5개만 표시

  const handleRemove = (lookId) => {
    alert(`아이템 ${lookId}가 삭제되었습니다.`);
  };

  return (
    <Box
      maxWidth="600px"
      margin="auto"
      bg="white"
      display="flex"
      flexDirection="column"
      paddingY={8}
      fontFamily={'Pretendard'}
      mt={10}
    >
      <VStack spacing={4} align="stretch">
        {looks.map((look) => (
          <Flex
            key={look.id}
            bg="white"
            boxShadow="md"
            borderRadius="3xl"
            p={4}
            alignItems="center"
            justifyContent="space-between"
            mb={4}
          >
            <HStack spacing={4} align="center">
              <Box
                width="80px"
                height="80px"
                bg="gray.100"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                <Image src={look.image} alt={look.title} boxSize="100%" />
              </Box>
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">
                  {look.title}
                </Text>
                <Text fontSize="md" color="gray.500">
                  {look.price}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  Size: {look.size}
                </Text>
              </VStack>
            </HStack>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Remove from cart"
              size="lg"
              borderRadius="full"
              bg="red.100"
              _hover={{ bg: 'red.200' }}
              onClick={() => handleRemove(look.id)}
            />
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default UserLooks;
