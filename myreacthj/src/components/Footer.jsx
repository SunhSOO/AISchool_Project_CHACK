import React from 'react';
import { Flex, Button, Icon } from '@chakra-ui/react';
import { FaHome, FaUser, FaShoppingCart } from 'react-icons/fa';
import { IoGridOutline } from 'react-icons/io5';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Flex
      as="footer"
      justify="space-around"
      align="center"
      bg="white"
      p={4}
      pos="fixed"
      bottom="0"
      left="0"
      right="0"
      boxShadow="inner"
      zIndex="1000"
      maxW="600px" // 최대 너비를 600px로 제한
      width="100%" // 화면이 600px보다 작을 때는 100% 너비로
      m="0 auto" // 수평 중앙 정렬
    >
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/home"
      >
        <Icon as={FaHome} boxSize={5} />
      </Button>
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/looksgallery"
      >
        <Icon as={IoGridOutline} boxSize={5} />
      </Button>
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/UserLooks"
      >
        <Icon as={FaShoppingCart} boxSize={5} />
      </Button>
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/mypage"
      >
        <Icon as={FaUser} boxSize={5} />
      </Button>
    </Flex>
  );
};

export default Footer;
