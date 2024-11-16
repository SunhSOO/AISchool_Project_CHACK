// src/components/ProductCard.jsx
import React, { useCallback } from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useCart } from './CartContext';
import { useClothing } from './ClothingContext';
import PropTypes from 'prop-types';

const CLOTHING_TYPES = {
  T_SHIRT: 'tshirt',
  PANTS: 'pants',
  SHORT_PANTS: 'shortPants',
  SHIRT: 'shirt',
  SKIRT: 'skirt',
};

const ProductCard = ({
  clo_idx,
  clo_img1_url,
  clo_name,
  clo_price,
  clo_desc,
  clo_type,
  clo_3d,
}) => {
  const toast = useToast();
  const { addToCart } = useCart();
  const { activeClothing, wearClothing, removeClothing } = useClothing();

  const isWearing = activeClothing.clo_3d && activeClothing.clo_3d[clo_type];

  const handleAddToCart = useCallback(() => {
    addToCart({
      clo_idx,
      clo_img1_url,
      clo_name,
      clo_price,
    });
    toast({
      title: '장바구니에 담겼습니다.',
      description: `${clo_name}이(가) 장바구니에 추가되었습니다.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  }, [addToCart, clo_idx, clo_img1_url, clo_name, clo_price, toast]);

  const handleTryOn = useCallback(() => {
    if (isWearing) {
      removeClothing(clo_type);
      toast({
        title: '의상을 제거했습니다.',
        description: `${clo_name}을(를) 제거했습니다.`,
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } else {
      wearClothing(clo_type, clo_3d);
      toast({
        title: '의상을 착용했습니다.',
        description: `${clo_name}을(를) 착용했습니다.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [
    isWearing,
    clo_type,
    clo_name,
    removeClothing,
    wearClothing,
    clo_3d,
    toast,
  ]);

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
              aria-label={isWearing ? '의상 제거' : '의상 착용'}
            >
              {isWearing ? '제거하기' : '입어보기'}
            </Button>
            <Button
              size="xs"
              colorScheme="red"
              borderRadius="lg"
              flex="1"
              onClick={handleAddToCart}
              aria-label="장바구니에 추가"
            >
              담기
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

ProductCard.propTypes = {
  clo_idx: PropTypes.number.isRequired,
  clo_img1_url: PropTypes.string.isRequired,
  clo_name: PropTypes.string.isRequired,
  clo_price: PropTypes.number.isRequired,
  clo_desc: PropTypes.string,
  clo_type: PropTypes.string.isRequired,
  clo_3d: PropTypes.object.isRequired,
};

export default ProductCard;
