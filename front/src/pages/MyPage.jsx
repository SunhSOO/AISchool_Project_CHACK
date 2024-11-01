// src/pages/MyPage.jsx

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
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import { FaUserEdit } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { useAuth } from '../components/AuthContext';

const MyPage = () => {
  const { user, logout } = useAuth(); // loading 제거
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isPurchaseOpen,
    onOpen: onPurchaseOpen,
    onClose: onPurchaseClose,
  } = useDisclosure();

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [editedUserData, setEditedUserData] = useState({
    user_name: user?.user_name || '',
    user_email: user?.user_email || '',
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('purchaseHistory');
    if (savedHistory) setPurchaseHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogout = () => logout();

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSave = () => {
    localStorage.setItem('user_name', editedUserData.user_name);
    localStorage.setItem('user_email', editedUserData.user_email);
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
        <Avatar size="lg" name={user?.user_name || 'Guest'} />
        <Box ml={4}>
          <Heading as="h2" size="md" color="white">
            {user?.user_name || 'Guest'}
          </Heading>
          <Text>{user?.user_email || 'No email available'}</Text>
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

      <VStack spacing={4} align="stretch">
        <Box
          p={4}
          bg="white"
          boxShadow="md"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          onClick={onPurchaseOpen}
          cursor="pointer"
        >
          <HStack>
            <Icon as={MdAccountCircle} boxSize={6} color="gray.600" />
            <Box>
              <Text fontWeight="bold">구매 목록</Text>
              <Text fontSize="sm" color="gray.500">
                이전 구매 내역을 확인합니다
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

      {/* Modal for editing user info */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>정보 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="사용자 이름"
                name="user_name"
                value={editedUserData.user_name}
                onChange={handleEditChange}
              />
              <Input
                placeholder="이메일"
                name="user_email"
                value={editedUserData.user_email}
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

      {/* Modal for purchase history */}
      <Modal isOpen={isPurchaseOpen} onClose={onPurchaseClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>구매 목록</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {purchaseHistory.length > 0 ? (
              <VStack align="stretch">
                {purchaseHistory.map((item, index) => (
                  <Box key={index} p={2} borderBottom="1px solid gray">
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text>${item.price}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">구매 내역이 없습니다.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onPurchaseClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyPage;
