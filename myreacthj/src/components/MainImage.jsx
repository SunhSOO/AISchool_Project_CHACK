import React, { useState } from 'react';
import { Image, Box, Flex, Button, Icon, HStack } from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi'; // 카메라 아이콘 불러오기
import lobotImage from '../assets/lobot.jpg';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

const MainImage = () => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleToggle = () => {
    setIsAvatarVisible(!isAvatarVisible);
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
    }
  };

  return (
    <Flex p={4} direction="column" align="center" width="100%">
      <Accordion defaultIndex={[0]} allowToggle width="100%" maxWidth="600px">
        <AccordionItem border="none">
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton
                  onClick={handleToggle}
                  bg="white"
                  borderRadius="full"
                  boxShadow="md"
                  _hover={{ bg: 'gray.100' }}
                  mb={4}
                >
                  <Box
                    as="span"
                    flex="1"
                    textAlign="center"
                    fontFamily="Pretendard"
                  >
                    {isExpanded ? '아바타 숨기기' : '아바타 보기'}
                  </Box>
                  <AccordionIcon ml={2} /> {/* 아이콘과 텍스트 간격 설정 */}
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                px={0}
                display="flex"
                justifyContent="center"
              >
                <Box
                  position="relative"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  width="100%"
                  maxWidth="300px"
                  height="auto"
                  display="flex"
                  justifyContent="center"
                >
                  {/* 이미지 위 버튼들 */}
                  <HStack
                    position="absolute"
                    top="10px"
                    right="10px"
                    spacing={2}
                    zIndex="1"
                  >
                    <Button size="sm" colorScheme="red" variant="solid">
                      선택
                    </Button>
                    <Button size="sm" colorScheme="gray" variant="outline">
                      수정
                    </Button>
                  </HStack>

                  <Image
                    src={capturedImage || lobotImage}
                    alt="Captured or Default"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      {/* 하단 카메라 버튼 */}
      <Button
        mt={4}
        bg="white"
        borderRadius="full"
        boxShadow="md"
        _hover={{ bg: 'gray.100' }}
        size="md"
        position="relative"
      >
        <Icon as={FiCamera} w={5} h={5} color="black" />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        />
      </Button>
    </Flex>
  );
};

export default MainImage;
