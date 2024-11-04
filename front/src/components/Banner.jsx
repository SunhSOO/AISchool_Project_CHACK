import React from 'react';
import { Box, Flex, Image, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import lobotImage from '../assets/lobot.jpg';

const StartComponent = () => {
  return (
    <Box
      bg="white"
      boxShadow="md"
      borderRadius="3xl"
      p={6}
      maxW={{ base: '350px', md: '600px' }} // 작은 화면에서는 350px, 큰 화면에서는 600px
      display="flex"
      alignItems="center"
      mt={4}
      mx="auto"
    >
      <Flex
        direction="row"
        justify="center"
        align="center"
        textAlign="left"
        w="100%"
        ml={{ base: 0, md: 12 }} // 모바일에서는 0, 웹에서는 24의 왼쪽 마진
      >
        {/* 왼쪽 텍스트와 버튼 */}
        <Box flex="1">
          <Text
            fontFamily={'Pretendard'}
            fontSize="2xl"
            fontWeight="bold"
            mb={2}
          >
            Chack 시작
          </Text>
          <Text fontFamily={'Pretendard'} fontSize="ms" mb={4} color="gray.600">
            고객님의 체형을 <br /> 설정 해보세요
          </Text>
          <Button
            fontFamily={'Pretendard'}
            as={RouterLink}
            to="/avatar"
            colorScheme="blackAlpha"
            variant="outline"
            size="sm"
            rightIcon={<Text as="span">→</Text>}
          >
            Start Now
          </Button>
        </Box>

        {/* 오른쪽 이미지 */}
        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <Image
            src={lobotImage}
            alt="Chack 시작"
            borderRadius="lg"
            width="90%" // 너비를 90%로 설정
            height="100%" // 높이를 100%로 고정
            maxH="400px" // 최대 높이를 설정 (필요에 따라 조정 가능)
            objectFit="cover" // 비율 유지하며 크기 조정
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default StartComponent;
