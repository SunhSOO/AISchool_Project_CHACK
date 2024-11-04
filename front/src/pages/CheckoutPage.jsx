// CheckoutPage.jsx
import React, { useEffect } from 'react';
import { Box, VStack, Text, Button, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCartItems =
      JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    setCartItems(savedCartItems); // 장바구니 데이터 초기화
  }, [setCartItems]);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.clo_price), 0)
      .toLocaleString(); // 세 자리마다 콤마 추가
  };

  const handlePurchase = () => {
    alert('결제가 완료되었습니다!');
    setCartItems([]); // 장바구니 비우기
    localStorage.setItem('cartItems', JSON.stringify([])); // localStorage에서도 초기화
    navigate('/userlooks'); // 구매 후 장바구니 페이지로 이동
  };

  return (
    <Box
      maxWidth="600px"
      margin="auto"
      bg="white"
      paddingY={8}
      paddingX={4}
      fontFamily="Pretendard"
      mt={10}
    >
      <Heading as="h1" size="lg" mb={4} textAlign="center">
        결제
      </Heading>
      <VStack spacing={4} align="stretch">
        {cartItems.map((item) => (
          <Box
            key={item.clo_idx}
            bg="gray.50"
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="md" fontWeight="bold">
              {item.clo_name}
            </Text>
            <Text fontSize="md" color="gray.500">
              ₩{parseInt(item.clo_price).toLocaleString()}{' '}
              {/* 세 자리마다 콤마 */}
            </Text>
          </Box>
        ))}
        <Box p={4} borderTop="1px" borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" textAlign="right">
            총합: ₩{calculateTotal()}원
          </Text>
        </Box>
        <Button
          colorScheme="red"
          size="lg"
          width="100%"
          mt={4}
          onClick={handlePurchase}
        >
          구매확정
        </Button>
        <Button
          variant="outline"
          size="lg"
          width="100%"
          mt={2}
          onClick={() => navigate('/userlooks')}
        >
          돌아가기
        </Button>
      </VStack>
    </Box>
  );
};

export default CheckoutPage;
