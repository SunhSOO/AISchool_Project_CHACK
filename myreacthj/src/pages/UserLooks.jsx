// UserLooks.jsx (장바구니 페이지)
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Flex,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useCart } from '../components/CartContext';

const UserLooks = () => {
  const { cartItems, removeFromCart } = useCart();

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.price), 0)
      .toFixed(2);
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
        {cartItems.map((item) => (
          <Flex
            key={item.id}
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
                <Image src={item.image} alt={item.title} boxSize="100%" />
              </Box>
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">
                  {item.title}
                </Text>
                <Text fontSize="md" color="gray.500">
                  ${item.price}
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
              onClick={() => removeFromCart(item.id)}
            />
          </Flex>
        ))}
        {cartItems.length > 0 && (
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Total:
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                ${calculateTotal()}
              </Text>
            </HStack>
            <Button
              colorScheme="red"
              size="lg"
              width="100%"
              mt={4}
              onClick={() => alert('Proceeding to checkout...')}
            >
              Checkout
            </Button>
          </Box>
        )}
        {cartItems.length === 0 && (
          <Text textAlign="center" color="gray.500" py={8}>
            Your cart is empty
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default UserLooks;
