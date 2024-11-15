// src/pages/ShoppingPage.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  useBreakpointValue,
  Flex,
  IconButton,
  Text,
  Button,
} from '@chakra-ui/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ClothingProvider } from '../components/ClothingContext';
import Categories from '../components/Categories';
import AvatarViewer from '../components/AvatarViewer';
import ProductGrid from '../components/ProductGrid';
import AvatarSelectionModal from '../components/AvatarSelectionModal'; // 새로 추가한 모달 컴포넌트

const ShoppingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  // 모바일에서 아바타 뷰어의 높이를 조절
  const avatarHeight = useBreakpointValue({
    base: '50vh', // 모바일
    md: '60vh', // 태블릿/데스크톱
  });

  return (
    <ClothingProvider>
      <VStack
        spacing={4}
        width="100%"
        maxW="600px"
        mx="auto"
        px={4}
        mt={16}
        mb={16}
      >
        {/* 아바타 뷰어 토글 헤더 */}
        <Flex
          w="100%"
          h="40px"
          bg="gray.100"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          cursor="pointer"
          onClick={() => setIsAvatarExpanded(!isAvatarExpanded)}
          _hover={{ bg: 'gray.200' }}
          borderRadius="3xl"
        >
          <Text fontWeight="medium">아바타 뷰어</Text>
          <IconButton
            icon={isAvatarExpanded ? <ChevronUp /> : <ChevronDown />}
            variant="ghost"
            size="sm"
            aria-label={isAvatarExpanded ? '접기' : '펼치기'}
          />
        </Flex>

        {/* 아바타 뷰어 영역 */}
        <Box
          width="100%"
          height={isAvatarExpanded ? avatarHeight : '0'}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="base"
          bg="gray.50"
          transition="height 0.3s ease-in-out"
          opacity={isAvatarExpanded ? 1 : 0}
          visibility={isAvatarExpanded ? 'visible' : 'hidden'}
        >
          <AvatarViewer />
          {/* 아바타 선택 버튼 */}
          {isAvatarExpanded && (
            <Flex justify="center" mt={2}>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                아바타 선택
              </Button>
            </Flex>
          )}
        </Box>

        {/* 상단 카테고리 */}
        <Box width="100%">
          <Categories
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Box>

        {/* 제품 그리드 영역 */}
        <Box
          width="100%"
          borderRadius="2xl"
          boxShadow="base"
          bg="white"
          flex="1"
          overflow="hidden"
        >
          <ProductGrid selectedCategory={selectedCategory} />
        </Box>
      </VStack>

      {/* 아바타 선택 모달 */}
      <AvatarSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </ClothingProvider>
  );
};

export default ShoppingPage;
