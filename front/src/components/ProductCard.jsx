// src/components/ProductCard.jsx

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
 * 이름 있는(named) 내보내기
 */
export const ProductCard = ({
  clo_idx,
  clo_img1_url,
  clo_name,
  clo_price,
  clo_desc,
  clo_mtl_url, // 변경: clo_mtl -> clo_mtl_url
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
    if (!clo_desc) {
      debugLog('try-on-error', 'No type available for:', { name: clo_name });
      toast({
        title: '의상 착용 실패',
        description: '의상 유형이 지정되지 않았습니다.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    // clo_mtl_url 데이터 확인
    console.log('Attempting to try on clothing:', {
      clo_desc,
      clo_idx,
      clo_mtl_url,
      clo_name,
      isWearing,
    });

    if (!clo_mtl_url || typeof clo_mtl_url !== 'string') {
      console.error('clo_mtl_url 데이터가 유효하지 않습니다:', clo_mtl_url);
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

    debugLog('try-on-action', 'Trying on clothing:', {
      type: clo_desc,
      texUrl: clo_mtl_url,
      isWearing,
    });

    if (isWearing) {
      // 착용 중인 의상을 벗기
      await removeClothing(clo_desc, clo_name);
      setIsWearing(false);
      toast({
        title: '의상 제거',
        description: `${clo_name}을(를) 제거했습니다.`,
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } else {
      // 의상을 입기
      await wearClothing(clo_desc, clo_idx, clo_mtl_url, clo_name);
      setIsWearing(true);
      toast({
        title: '의상 착용',
        description: `${clo_name}을(를) 착용했습니다.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
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
