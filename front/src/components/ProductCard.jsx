import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { useCart } from './CartContext';
import { useClothing } from '../contexts/ClothingContext';
import { debugLog } from '../utils/logging';

/**
 * ProductCard 컴포넌트
 */
export const ProductCard = ({
  clo_idx,
  clo_img1_url,
  clo_name,
  clo_price,
  clo_desc,
  clo_mtl_url,
}) => {
  const toast = useToast();
  const { addToCart } = useCart();
  const { wearClothing, removeClothing, fittings } = useClothing();
  const [isWearing, setIsWearing] = useState(false);

  // 현재 의상이 착용 중인지 확인
  useEffect(() => {
    const isCurrentlyWearing = fittings.some(
      (fitting) => fitting.clo_idx === clo_idx
    );
    setIsWearing(isCurrentlyWearing);
  }, [fittings, clo_idx]);

  const handleAddToCart = () => {
    addToCart({
      clo_idx,
      clo_img1_url,
      clo_name,
      clo_price,
    });
    toast({
      title: '장바구니에 담겼습니다',
      description: `${clo_name}이(가) 장바구니에 추가되었습니다.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleTryOn = async () => {
    if (!clo_desc || typeof clo_desc !== 'string') {
      debugLog('try-on-error', 'Invalid clothing type:', {
        clo_name,
        clo_desc,
      });
      toast({
        title: '의상 착용 실패',
        description: '의상 유형이 올바르지 않습니다.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (!clo_mtl_url || typeof clo_mtl_url !== 'string') {
      debugLog('try-on-error', 'Invalid material URL:', { clo_mtl_url });
      toast({
        title: '의상 착용 실패',
        description: '의류 데이터가 손상되었습니다.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      if (isWearing) {
        // 착용 중인 의상을 벗기
        debugLog('try-on-remove', 'Removing clothing:', { clo_desc, clo_name });
        await removeClothing(clo_desc, clo_name);
        setIsWearing(false);
        toast({
          title: '의상 제거',
          description: `${clo_name}을(를) 제거했습니다.`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      } else {
        // 의상을 입기
        debugLog('try-on-wear', 'Wearing clothing:', {
          clo_desc,
          clo_idx,
          clo_mtl_url,
          clo_name,
        });
        await wearClothing(clo_desc, clo_idx, clo_mtl_url, clo_name);
        setIsWearing(true);
        toast({
          title: '의상 착용',
          description: `${clo_name}을(를) 착용했습니다.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      debugLog('try-on-error', 'Error in try-on process:', error);
      toast({
        title: '처리 실패',
        description: error.message || '의상 착용/제거 처리에 실패했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      height="100%"
      shadow="sm"
    >
      <Box position="relative" paddingTop="100%">
        <Image
          src={clo_img1_url}
          alt={clo_name}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box p="2">
        <VStack spacing={1} align="stretch">
          <Text fontWeight="medium" fontSize="xs" noOfLines={1}>
            {clo_name}
          </Text>
          <Text fontSize="xs" fontWeight="bold" color="gray.800">
            ₩{parseInt(clo_price).toLocaleString()}
          </Text>
          <HStack spacing={1}>
            <Button
              size="xs"
              colorScheme={isWearing ? 'red' : 'blue'}
              borderRadius="lg"
              flex="1"
              onClick={handleTryOn}
            >
              {isWearing ? '제거하기' : '입어보기'}
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              borderRadius="lg"
              flex="1"
              onClick={handleAddToCart}
            >
              담기
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
