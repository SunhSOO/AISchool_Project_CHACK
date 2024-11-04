// src/components/PromotionBanner.js
import React from 'react';
import Slider from 'react-slick';
import { Box, Image, Flex } from '@chakra-ui/react';
import Banner1 from '../assets/banner1.svg';
import Banner2 from '../assets/banner2.svg';
import Banner3 from '../assets/banner3.svg';

// 슬라이드할 배너 이미지 배열
const banners = [
  { id: 1, src: Banner1, alt: 'Promotion Banner 1' },
  { id: 2, src: Banner2, alt: 'Promotion Banner 2' },
  { id: 3, src: Banner3, alt: 'Promotion Banner 3' },
];

const PromotionBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    swipe: true,
    appendDots: (dots) => (
      <Flex justify="center" mt={2} zIndex="1">
        {dots}
      </Flex>
    ),
  };

  return (
    <Box
      maxW={{ base: '350px', md: '600px' }} // 작은 화면에서는 350px, 큰 화면에서는 600px로 설정
      mx="auto"
      bg="white"
      borderRadius="3xl"
      boxShadow="sm"
      mt={4}
      mb={7}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box
            key={banner.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              objectFit="cover" // 이미지 비율을 유지하며 크기를 조정
              width="100%" // 너비를 100%로 설정
              height="100%" // 높이를 100%로 설정
              borderRadius="md"
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PromotionBanner;
