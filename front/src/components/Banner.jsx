import React from 'react';
import { Box, Flex, Image, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import lobotImage from '../assets/lobot.jpg';

const StartComponent = () => {
  return (
    <Box
      bg="white"
      boxShadow="md"
      borderRadius="lg"
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
      >
        {/* 왼쪽 텍스트와 버튼 */}
        <Box flex="1" ml={35}>
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
          ml={4}
          mr={35}
        >
          <Image
            src={lobotImage}
            alt="Chack 시작"
            borderRadius="lg"
            boxSize="400px" // 이미지 크기 설정
            objectFit="cover"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default StartComponent;
