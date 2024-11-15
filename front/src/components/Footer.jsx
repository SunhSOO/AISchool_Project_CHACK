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
    >
      <Button
        variant="ghost"
        flexDirection="column"
        fontSize="xs"
        as={RouterLink}
        to="/home"
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }}
        _focus={{ bg: 'transparent', boxShadow: 'none' }} // 포커스 시 배경색 및 그림자 제거
        _active={{ bg: 'transparent', boxShadow: 'none' }} // 클릭 시 배경색 및 그림자 제거
        transition="transform 0.2s"
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
        to="/shopping"
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }}
        _focus={{ bg: 'transparent', boxShadow: 'none' }}
        _active={{ bg: 'transparent', boxShadow: 'none' }}
        transition="transform 0.2s"
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
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }}
        _focus={{ bg: 'transparent', boxShadow: 'none' }}
        _active={{ bg: 'transparent', boxShadow: 'none' }}
        transition="transform 0.2s"
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
        _hover={{ bg: 'transparent', transform: 'scale(1.1)' }}
        _focus={{ bg: 'transparent', boxShadow: 'none' }}
        _active={{ bg: 'transparent', boxShadow: 'none' }}
        transition="transform 0.2s"
      >
        <Box {...getIconStyle('/mypage')}>
          <Icon as={FaUser} boxSize={5} />
        </Box>
      </Button>
    </Flex>
  );
};

export default Footer;
