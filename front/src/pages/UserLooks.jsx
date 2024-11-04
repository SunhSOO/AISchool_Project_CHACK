// UserLooks.jsx
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
import { useNavigate } from 'react-router-dom';

const UserLooks = () => {
  const { cartItems, removeFromCart, setCartItems } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.clo_price),
      0
    );
  };

  const handleCheckout = () => {
    const purchaseData = [...cartItems];
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseData));
    localStorage.setItem('cartItems', JSON.stringify([]));
    setCartItems([]);
    navigate('/checkout');
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
            key={item.clo_idx} // 고유한 값으로 설정
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
                <Image
                  src={item.clo_img1_url}
                  alt={item.clo_name}
                  boxSize="100%"
                />
              </Box>
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">
                  {item.clo_name}
                </Text>
                <Text fontSize="md" color="gray.500">
                  ₩{item.clo_price}
                </Text>
              </VStack>
            </HStack>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="장바구니에서 제거"
              size="lg"
              borderRadius="full"
              bg="red.100"
              _hover={{ bg: 'red.200' }}
              onClick={() => {
                console.log(`Removing item with clo_idx: ${item.clo_idx}`);
                removeFromCart(item.clo_idx); // 아이템 고유 ID 전달
              }}
            />
          </Flex>
        ))}
        {cartItems.length > 0 && (
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                총합:
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                ₩{parseInt(calculateTotal()).toLocaleString()}원
              </Text>
            </HStack>
            <Button
              colorScheme="red"
              size="lg"
              width="100%"
              mt={4}
              onClick={handleCheckout}
            >
              결제
            </Button>
          </Box>
        )}
        {cartItems.length === 0 && (
          <Text textAlign="center" color="gray.500" py={8}>
            장바구니가 비어 있습니다
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default UserLooks;
