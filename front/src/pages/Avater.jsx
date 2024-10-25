import React, { useState } from 'react';
import {
  Image,
  Box,
  Flex,
  Button,
  Icon,
  useDisclosure,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import lobotImage from '../assets/lobot.jpg';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import CaptureGuide from '../components/CaptureGuide';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 가져오기

const Avater = () => {
  const navigate = useNavigate(); // navigate 함수 호출
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
                    borderRadius="full"
                    top="20px" // 상단 위치 조정
                    left="20px" // 좌측 여백 조정
                    size="sm"
                    onClick={onOpen}
                    zIndex="2"
                    variant="outline" // 스포크만 주는 설정
                    _hover={{ bg: 'gray.100' }} // 호버 시 약간의 배경색 추가
                  >
                    촬영 가이드
                  </Button>

                  <Button
                    position="absolute"
                    borderRadius="full"
                    top="20px" // 상단 위치 조정
                    right="20px" // 우측 여백 조정
                    size="sm"
                    variant="outline" // 테두리만 있는 버튼
                    colorScheme="gray" // 테두리 색상
                    zIndex="2"
                    _hover={{ bg: 'gray.100' }} // 호버 시 배경색 설정
                  >
                    재촬영
                  </Button>

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
            navigate('/measurement-form');
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
