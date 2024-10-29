import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  Image,
  Button,
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import guideImage1 from '../assets/guide1.png'; // 올바른 자세 이미지
import guideImage2 from '../assets/guide2.png'; // 바른 자세가 아닌 경우 이미지
import guideImage3 from '../assets/guide3.png'; // 수직 수평 맞추기 이미지

const CaptureGuide = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={['sm', 'md']}
      fontFamily={'Pretendard'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>촬영 가이드</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
          >
            {/* 첫 번째 슬라이드 */}
            <SwiperSlide>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
                minHeight="600px"
                mb={4}
              >
                <Image
                  src={guideImage1}
                  alt="올바른 자세"
                  borderRadius="md"
                  width="80%" // 모든 이미지에 일관된 너비 적용
                  maxWidth="300px"
                  maxHeight="400px"
                  objectFit="cover"
                  mb={4}
                />
                <Text textAlign="center" mb={2}>
                  정면을 바라보고 올바른 자세로 촬영해주세요. 자세가 바르지
                  않으면 측정에 영향을 줄 수 있습니다.
                </Text>
                <Button
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.600' }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                >
                  옆으로 밀어주세요 →
                </Button>
              </Box>
            </SwiperSlide>

            {/* 두 번째 슬라이드 */}
            <SwiperSlide>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                minHeight="600px"
                mb={4}
                mt={110}
                justifyContent="flex-start" // 이미지를 상단에 배치
              >
                <Image
                  src={guideImage2}
                  alt="바른 자세가 아닌 경우"
                  borderRadius="md"
                  width="70%"
                  maxWidth="150px"
                  maxHeight="300px"
                  objectFit="cover"
                  mb={4} // 이미지와 텍스트 사이에 약간의 마진 추가
                />
                <Text textAlign="center" mt={4}>
                  {' '}
                  {/* 텍스트 상단에 여백 추가 */}
                  자세가 바르지 않으면 정확한 측정이 어려울 수 있습니다.
                  가능하면 자세를 바르게 유지해주세요.
                </Text>
              </Box>
            </SwiperSlide>

            {/* 세 번째 슬라이드 */}
            <SwiperSlide>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
                minHeight="600px"
                mb={4}
              >
                <Image
                  src={guideImage3}
                  alt="수직 수평 맞추기"
                  borderRadius="md"
                  width="80%"
                  maxWidth="300px"
                  maxHeight="400px"
                  objectFit="cover"
                  mb={4}
                />
                <Text textAlign="center">
                  수직 수평이 맞지 않으면 사진이 왜곡될 수 있습니다. 촬영 시
                  카메라를 수평으로 맞춰주세요.
                </Text>
              </Box>
            </SwiperSlide>
          </Swiper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CaptureGuide;
