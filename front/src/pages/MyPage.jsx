import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Avatar,
  Text,
  Heading,
  Button,
  HStack,
  Switch,
  Icon,
} from '@chakra-ui/react';
import { FaUserEdit, FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MdAccountCircle, MdSecurity } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box
      maxWidth="600px"
      margin="auto"
      p={4}
      bg="white"
      fontFamily="Pretendard"
      mt={10}
      height="100vh"
    >
      <Text fontSize="4xl" fontWeight="bold" mb={2}>
        Profile
      </Text>
      <Box
        bg="red.500"
        borderRadius="2xl"
        p={4}
        display="flex"
        alignItems="center"
        color="white"
        mb={6}
      >
        <Avatar size="lg" name={userData.username} />
        <Box ml={4}>
          <Heading as="h2" size="md" color="white">
            {userData.username}
          </Heading>
          <Text>{userData.email}</Text>
        </Box>
        <Button
          ml="auto"
          variant="ghost"
          color="white"
          leftIcon={<FaUserEdit />}
        >
          수정
        </Button>
      </Box>
      <VStack spacing={4} align="stretch">
        <Box
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
        >
          <HStack>
            <Icon as={MdAccountCircle} boxSize={6} color="gray.600" />
            <Box>
              <Text fontWeight="bold">내 계정</Text>
              <Text fontSize="sm" color="gray.500">
                계정 정보를 변경합니다
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={handleLogout}
          cursor="pointer"
        >
          <HStack>
            <Icon as={FiLogOut} boxSize={6} color="gray.600" />
            <Box>
              <Text fontWeight="bold">로그아웃</Text>
              <Text fontSize="sm" color="gray.500">
                계정 보안을 위해 로그아웃합니다
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MyPage;
