// src/components/AvatarLoading.jsx

import React from 'react';
import {
  Box,
  VStack,
  Spinner,
  Text,
  Container,
  Heading,
} from '@chakra-ui/react';

const AvatarLoading = () => {
  // 임시 데이터 (실제로는 props나 상태로 받게 됨)
  const recommendedSize = 'M';

  return (
    <Container maxW="container.md" py={20}>
      <VStack
        spacing={8}
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
      >
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb={6} fontFamily="Pretendard">
            3D 아바타 생성 중
          </Heading>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="red.500"
            size="xl"
            mb={8}
          />
          <Text
            fontSize="xl"
            fontWeight="medium"
            color="gray.700"
            fontFamily="Pretendard"
          >
            당신에게 추천해드릴 사이즈는{' '}
            <Text as="span" color="red.500" fontWeight="bold">
              {recommendedSize}
            </Text>
            입니다.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default AvatarLoading;
