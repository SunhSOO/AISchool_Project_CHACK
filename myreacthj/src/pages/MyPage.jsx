import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Avatar,
  Text,
  Heading,
  Button,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { FaUserEdit } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  const [editedUserData, setEditedUserData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    const username = localStorage.getItem('username') || '이현준';
    const email = localStorage.getItem('email') || '이메일@example.com';

    if (username && email) {
      setUserData({ username, email });
      setEditedUserData({ username, email });
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSave = () => {
    setUserData(editedUserData);
    localStorage.setItem('username', editedUserData.username);
    localStorage.setItem('email', editedUserData.email);
    onEditClose();
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
          onClick={onEditOpen}
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
          onClick={onCartOpen}
          cursor="pointer"
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

        {/* 로그아웃 섹션 */}
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

      {/* 정보 수정 모달 */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>정보 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="사용자 이름"
                name="username"
                value={editedUserData.username}
                onChange={handleEditChange}
              />
              <Input
                placeholder="이메일"
                name="email"
                value={editedUserData.email}
                onChange={handleEditChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleEditSave}>
              저장
            </Button>
            <Button onClick={onEditClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 장바구니 정보 모달 */}
      <Modal isOpen={isCartOpen} onClose={onCartClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>장바구니 정보</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>장바구니에 담긴 상품 정보가 여기에 표시됩니다.</Text>
            {/* 실제 장바구니 정보를 나중에 여기에 추가 */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onCartClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyPage;
