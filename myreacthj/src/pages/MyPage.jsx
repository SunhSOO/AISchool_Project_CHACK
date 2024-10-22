import React from 'react';
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
import Userimage from '../assets/Userimage.png';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  const handleLogout = () => {
    // 로그아웃 시 처리할 작업 (세션 삭제 등)
    navigate('/'); // LoginPage로 이동
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
      {/* Profile 텍스트 */}
      <Text fontSize="4xl" fontWeight="bold" mb={2}>
        Profile
      </Text>

      {/* 프로필 섹션 */}
      <Box
        bg="red.500"
        borderRadius="2xl"
        p={4}
        display="flex"
        alignItems="center"
        color="white"
        mb={6}
      >
        <Avatar size="lg" name="이현준" src={Userimage} />
        <Box ml={4}>
          <Heading as="h2" size="md" color="white">
            이현준
          </Heading>
          <Text>@이메일</Text>
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

      {/* 설정 목록 */}
      <VStack spacing={4} align="stretch">
        <Box
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
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
        >
          <HStack>
            <Icon as={FaUserCircle} boxSize={6} color="gray.600" />
            <Box>
              <Text fontWeight="bold">저장된 계좌</Text>
              <Text fontSize="sm" color="gray.500">
                저장된 계좌를 관리합니다
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
        >
          <HStack>
            <Icon as={MdSecurity} boxSize={6} color="gray.600" />
            <Box>
              <Text fontWeight="bold">Face ID / Touch ID</Text>
              <Text fontSize="sm" color="gray.500">
                기기 보안을 관리합니다
              </Text>
            </Box>
          </HStack>
          <Switch colorScheme="teal" />
        </Box>

        <Box
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack>
            <Icon as={MdSecurity} boxSize={6} color="gray.600" />
            <Box>
              <Text fontWeight="bold">2단계 인증</Text>
              <Text fontSize="sm" color="gray.500">
                계정의 추가 보안을 설정합니다
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* 로그아웃 섹션 */}
        <Box
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={handleLogout} // 클릭 시 로그아웃 함수 호출
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
