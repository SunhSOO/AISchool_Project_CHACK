// src/components/CaptureGuide.js
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
import { Pagination } from 'swiper';
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
            <SwiperSlide>
              <Box>
                <Image
                  src={guideImage1}
                  alt="올바른 자세"
                  borderRadius="md"
                  width="100%"
                  maxHeight="600px"
                  objectFit="cover"
                  mb={4}
                />
                <Text>
                  정면을 바라보고 올바른 자세로 촬영해주세요.<br></br> 자세가
                  바르지 않으면 측정에 영향을 줄 수 있습니다.
                </Text>
                <Button
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: 'blue.600' }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                  onClick={() => alert('다음 이미지로 이동')}
                >
                  옆으로 밀어주세요 →
                </Button>
              </Box>
            </SwiperSlide>
            <SwiperSlide>
              <Box
                minHeight={600}
                justifyContent="center"
                alignItems="center"
                width="100%"
                mb={4}
              >
                <Image
                  src={guideImage2}
                  alt="바른 자세가 아닌 경우"
                  borderRadius="md"
                  width="150px"
                  maxHeight="600px"
                  mb={4}
                />
                <Text>
                  자세가 바르지 않으면 정확한 측정이 어려울 수 있습니다.
                  가능하면 자세를 바르게 유지해주세요.
                </Text>
              </Box>
            </SwiperSlide>
            <SwiperSlide>
              <Box>
                <Image
                  src={guideImage3}
                  alt="수직 수평 맞추기"
                  borderRadius="md"
                  width="100%"
                  maxHeight="500px"
                  objectFit="cover"
                  mb={4}
                />
                <Text>
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
