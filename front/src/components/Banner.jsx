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
      maxW={{ base: '350px', md: '600px' }}
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
        ml={{ base: 0, md: 12 }}
      >
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
            to="/camera-upload" // 변경된 부분
            colorScheme="blackAlpha"
            variant="outline"
            size="sm"
            rightIcon={<Text as="span">→</Text>}
          >
            Start Now
          </Button>
        </Box>

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
            width="90%"
            height="100%"
            maxH="400px"
            objectFit="cover"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default StartComponent;
