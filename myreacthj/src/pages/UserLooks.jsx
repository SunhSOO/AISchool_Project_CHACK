import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Grid,
  GridItem,
  Flex,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// 룩 데이터 (실제로는 API에서 가져올 것입니다)
const initialLooks = [
  {
    id: 1,
    title: 'Beige chic winter',
    price: '459 TND',
    rating: 4,
    image: 'https://via.placeholder.com/150', // 이미지 경로
  },
  {
    id: 2,
    title: 'Party shiny red look',
    price: '339 TND',
    rating: 5,
    image: 'https://via.placeholder.com/150', // 이미지 경로
  },
  {
    id: 3,
    title: 'Denim stylish look',
    price: '299 TND',
    rating: 4,
    image: 'https://via.placeholder.com/150', // 이미지 경로
  },
  {
    id: 4,
    title: 'Black biker look',
    price: '399 TND',
    rating: 5,
    image: 'https://via.placeholder.com/150', // 이미지 경로
  },
];

const UserLooks = () => {
  const [looks, setLooks] = useState(initialLooks); // 초기 데이터 상태

  // 별점을 클릭했을 때 실행되는 함수
  const handleRatingClick = (lookId, newRating) => {
    // 클릭된 룩의 id에 맞는 rating을 업데이트
    const updatedLooks = looks.map((look) =>
      look.id === lookId ? { ...look, rating: newRating } : look
    );
    setLooks(updatedLooks); // 상태 업데이트
  };

  return (
    <Box
      maxWidth="600px"
      margin="auto"
      bg="white"
      display="flex"
      flexDirection="column"
      minHeight="100vh" // 전체 화면 높이를 채우도록 설정
      paddingBottom="50px" // 하단에 고정된 버튼에 공간을 확보
      paddingTop="50px" // 상단에 헤더에 가려지지 않도록 패딩 추가
      fontFamily={'Pretendard'}
    >
      <VStack
        spacing={4}
        align="stretch"
        flex="1" // 남은 공간을 차지하도록 설정
        overflowY="auto" // 콘텐츠가 화면을 넘어갈 때 스크롤 가능하게 설정
      >
        {/* User Profile */}
        {/* <HStack spacing={4} p={4}>
          <Avatar
            size="lg"
            name="Arouja Riri"
            src="https://via.placeholder.com/100"
          >
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">이현준</Text>
            <Text color="gray.500">(7 Looks)</Text>
          </VStack>
        </HStack> */}

        {/* Tabs */}
        <HStack spacing={4} p={4} justify="center">
          <Button colorScheme="blackAlpha" variant="solid" flexGrow={1}>
            좋아요 목록
          </Button>
        </HStack>

        {/* Looks Grid */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
          {looks.map((look) => (
            <GridItem key={look.id} w="100%">
              <VStack
                align="stretch"
                spacing={3}
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                p={4}
              >
                <Image src={look.image} alt={look.title} borderRadius="md" />
                <Text fontSize="sm" fontWeight="medium" textAlign="center">
                  {look.title}
                </Text>
                <Flex justifyContent="center" alignItems="center">
                  <HStack justifyContent="center" spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        color={i < look.rating ? 'yellow.400' : 'gray.300'}
                        cursor="pointer"
                        onClick={() => handleRatingClick(look.id, i + 1)}
                      />
                    ))}
                  </HStack>
                </Flex>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      {/* Style Look Button */}
      <Button
        position="fixed"
        bottom="4"
        left="50%"
        transform="translateX(-50%)"
        colorScheme="pink"
        size="lg"
        borderRadius="full"
        px={8}
        zIndex="1000" // 버튼이 스크롤 위에 표시되도록 설정
      >
        STYLE LOOK
      </Button>
    </Box>
  );
};

export default UserLooks;
