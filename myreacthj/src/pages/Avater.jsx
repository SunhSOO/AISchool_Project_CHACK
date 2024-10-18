import React, { useState } from 'react';
import {
  Image,
  Box,
  Flex,
  Button,
  Icon,
  useDisclosure,
  IconButton,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { ArrowBackIcon } from '@chakra-ui/icons';
import lobotImage from '../assets/lobot.jpg';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import CaptureGuide from '../components/CaptureGuide';

const Avater = () => {
  const [isAvatarVisible, setIsAvatarVisible] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [gender, setGender] = useState(''); // 남자/여자 선택 상태
  const [height, setHeight] = useState(''); // 키 입력 상태
  const [weight, setWeight] = useState(''); // 몸무게 입력 상태
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleGenderSelection = (selectedGender) => {
    setGender(selectedGender);
  };

  return (
    <Flex
      p={4}
      direction="column"
      align="center"
      width="100%"
      mt={12}
      height="150vh"
    >
      <Accordion
        defaultIndex={[0]}
        allowToggle
        width="100%"
        maxWidth={['350px', '600px']}
        mb={4}
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
                  zIndex="1"
                >
                  <Box
                    as="span"
                    flex="1"
                    textAlign="center"
                    fontFamily="Pretendard"
                  >
                    {isExpanded ? '아바타 숨기기' : '아바타 보기'}
                  </Box>
                  <AccordionIcon ml={2} />
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
                  <Button
                    position="absolute"
                    top="10px"
                    left="10px"
                    colorScheme="green"
                    size="sm"
                    onClick={onOpen}
                    zIndex="2"
                    boxShadow="md"
                    _hover={{ bg: 'green.100' }}
                  >
                    촬영 가이드
                  </Button>

                  <IconButton
                    icon={<ArrowBackIcon />}
                    position="absolute"
                    top="10px"
                    right="10px"
                    size="lg"
                    variant="ghost"
                    zIndex="2"
                    aria-label="뒤로 가기"
                  />

                  <Image
                    src={capturedImage || lobotImage}
                    alt="Captured or Default"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />

                  <Button
                    bg="white"
                    borderRadius="full"
                    boxShadow="md"
                    _hover={{ bg: 'gray.100' }}
                    size="md"
                    position="absolute"
                    bottom="10px"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex="2"
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
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      {/* 성별 선택 및 키, 몸무게 입력 필드 */}
      <VStack
        spacing={4}
        width="100%"
        maxWidth={['350px', '600px']}
        p={4}
        boxShadow="md"
        borderRadius="lg"
        bg="white"
      >
        <Flex justifyContent="space-between" width="100%">
          <Button
            flex="1"
            variant={gender === 'male' ? 'solid' : 'outline'}
            colorScheme={gender === 'male' ? 'blue' : 'gray'}
            onClick={() => handleGenderSelection('male')}
            mr={2}
          >
            MALE
          </Button>
          <Button
            flex="1"
            variant={gender === 'female' ? 'solid' : 'outline'}
            colorScheme={gender === 'female' ? 'pink' : 'gray'}
            onClick={() => handleGenderSelection('female')}
            ml={2}
          >
            FEMALE
          </Button>
        </Flex>

        <Box width="100%">
          <Text fontWeight="bold" mb={1}>
            Height
          </Text>
          <Input
            placeholder="Enter your height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            bg="gray.100"
            borderRadius="md"
            mb={2}
          />
          <Text fontWeight="bold" mb={1}>
            Weight
          </Text>
          <Input
            placeholder="Enter your weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            bg="gray.100"
            borderRadius="md"
          />
        </Box>

        <Button
          colorScheme="teal"
          size="md"
          onClick={() => {
            console.log('Selected gender:', gender);
            console.log('Height:', height);
            console.log('Weight:', weight);
            // 나중에 서버와 연결할 때 이 부분에서 데이터 전송
          }}
        >
          Submit
        </Button>
      </VStack>

      <CaptureGuide isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Avater;
