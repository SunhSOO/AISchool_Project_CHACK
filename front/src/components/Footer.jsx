// src/components/Footer.js
import React from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { FaHome, FaHeart, FaUser } from 'react-icons/fa';
import { IoGridOutline } from 'react-icons/io5';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const getIconStyle = (path) => {
    return location.pathname === path
      ? {
          borderBottom: '2px solid black', // 밑줄 추가
          width: 'fit-content', // 아이콘 크기에 맞게 너비 설정
          paddingBottom: '2px', // 아이콘과 밑줄 간격
        }
      : {};
  };

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
      maxW="600px"
      width="100%"
      m="0 auto"
      borderTopRadius="20px" // 위쪽 모서리를 둥글게 만듭니다
    >
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/home"
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }} // 호버 시 배경색 제거, 크기만 커짐
        transition="transform 0.2s" // 크기 변화 시 애니메이션 부드럽게
      >
        <Box {...getIconStyle('/home')}>
          <Icon as={FaHome} boxSize={5} />
        </Box>
      </Button>
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/ShoppingPage"
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }} // 호버 시 배경색 제거, 크기만 커짐
        transition="transform 0.2s" // 크기 변화 시 애니메이션 부드럽게
      >
        <Box {...getIconStyle('/ShoppingPage')}>
          <Icon as={IoGridOutline} boxSize={5} />
        </Box>
      </Button>
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/UserLooks"
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }} // 호버 시 배경색 제거, 크기만 커짐
        transition="transform 0.2s" // 크기 변화 시 애니메이션 부드럽게
      >
        <Box {...getIconStyle('/UserLooks')}>
          <Icon as={FaHeart} boxSize={5} />
        </Box>
      </Button>
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/mypage"
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }} // 호버 시 배경색 제거, 크기만 커짐
        transition="transform 0.2s" // 크기 변화 시 애니메이션 부드럽게
      >
        <Box {...getIconStyle('/mypage')}>
          <Icon as={FaUser} boxSize={5} />
        </Box>
      </Button>
    </Flex>
  );
};

export default Footer;
