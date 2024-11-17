// src/components/AvatarSelectionModal.jsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Image,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const AvatarSelectionModal = ({ isOpen, onClose }) => {
  const avatars = [
    {
      id: 1,
      name: '아바타 1',
      imageUrl: '/avatars/avatar1.png',
    },
    {
      id: 2,
      name: '아바타 2',
      imageUrl: '/avatars/avatar2.png',
    },
    // 더 많은 아바타...
  ];

  const handleSelect = (avatar) => {
    console.log('선택한 아바타:', avatar);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>아바타 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {avatars.map((avatar) => (
              <Button
                key={avatar.id}
                variant="outline"
                width="100%"
                onClick={() => handleSelect(avatar)}
                leftIcon={
                  <Image
                    src={avatar.imageUrl}
                    alt={avatar.name}
                    boxSize="24px"
                  />
                }
                justifyContent="flex-start"
              >
                {avatar.name}
              </Button>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AvatarSelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvatarSelectionModal;
