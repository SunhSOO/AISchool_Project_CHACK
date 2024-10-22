import React, { useState } from 'react';
import { Image, Box, Flex, Button, Icon, IconButton } from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi'; // 카메라 아이콘 불러오기
import { ArrowBackIcon } from '@chakra-ui/icons'; // 뒤로 가기 아이콘 불러오기
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
      <Accordion
        defaultIndex={[0]}
        allowToggle
        width="100%"
        maxWidth={['350px', '600px']}
      >
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
                  width="100%"
                  justifyContent="center"
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
                  maxWidth={['350px', '600px']}
                  height="auto"
                  display="flex"
                  justifyContent="center"
                >
                  {/* 이미지 위에 뒤로 가기 버튼 */}
                  <IconButton
                    icon={<ArrowBackIcon />}
                    position="absolute"
                    top="10px"
                    right="10px"
                    size="lg"
                    variant="ghost"
                    zIndex="1"
                    aria-label="뒤로 가기"
                  />

                  <Image
                    src={capturedImage || lobotImage}
                    alt="Captured or Default"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />

                  {/* 이미지 내부 하단 가운데에 카메라 버튼 */}
                  <Button
                    bg="white"
                    borderRadius="full"
                    boxShadow="md"
                    _hover={{ bg: 'gray.100' }}
                    size="lg" // 버튼 크기 증가
                    position="absolute"
                    bottom="10px"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex="2"
                    width="200px" // 버튼의 폭을 키움
                    height="60px" // 버튼의 높이를 키움
                  >
                    <Icon as={FiCamera} w={8} h={8} color="black" />{' '}
                    {/* 아이콘 크기를 증가 */}
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
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export default MainImage;
