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
        {dots} {/* 기존에 제공된 점을 그대로 사용 */}
      </Flex>
    ),
  };

  return (
    <Box
      p={0} // 내부 여백을 없앰
      maxW="100%"
      mx="auto"
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      mt={4}
      mb={7}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box key={banner.id}>
            <Image
              src={banner.src}
              alt={banner.alt}
              objectFit="cover"
              width="100%"
              height="100%" // 고정된 높이 설정
              borderRadius="md"
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PromotionBanner;
