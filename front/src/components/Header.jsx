import React, { useEffect, useState } from 'react';
import {
  Flex,
  IconButton,
  Image,
  Link,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  ArrowBackIcon,
  AddIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Flex
        height={70}
        maxW="600px"
        width="100%"
        as="header"
        justify="space-between"
        align="center"
        bg="#404040"
        boxShadow="sm"
        p={4}
        pos="fixed"
        top={isHeaderVisible ? '0' : '-80px'}
        left="0"
        right="0"
        zIndex="1000"
        m="0 auto"
        transition="top 0.3s ease-in-out"
      >
        <IconButton
          variant="ghost"
          icon={<ArrowBackIcon boxSize={['24px', '28px', '32px']} />}
          color="white"
          aria-label="뒤로 가기"
          onClick={handleBackClick}
          background="none" // 배경 제거
          borderRadius="3xl"
          _hover={{ background: 'none' }} // 호버 시 배경 제거
          _active={{ background: 'none' }} // 클릭 시 배경 제거
          _focus={{ boxShadow: 'none' }} // 포커스 시 박스 그림자 제거
        />

        <Link
          as={RouterLink}
          to="/home"
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          overflow="hidden" // 로고 하단 클릭 방지
          display="flex" // Link 요소 크기에 맞게 적용
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={logoImage}
            alt="logo"
            boxSize={['90px', '100px']}
            objectFit="contain"
            mb={3}
          />
        </Link>

        <IconButton
          ref={btnRef}
          variant="ghost"
          icon={<HamburgerIcon boxSize={['24px', '28px', '32px']} />}
          color="white"
          aria-label="메뉴 열기"
          borderRadius="3xl"
          onClick={onOpen}
        />
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        preserveScrollBarGap // 스크롤바 공간 유지
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>메뉴</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start">
              <Button
                leftIcon={<AddIcon />}
                w="100%"
                borderRadius="3xl"
                onClick={() => {
                  navigate('/MyPage');
                  onClose();
                }}
              >
                나의 정보
              </Button>
              <Button
                leftIcon={<RepeatClockIcon />}
                w="100%"
                borderRadius="3xl"
                onClick={() => {
                  navigate('/userlooks');
                  onClose();
                }}
              >
                장바구니
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
