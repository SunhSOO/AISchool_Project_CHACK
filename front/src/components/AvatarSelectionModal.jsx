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
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import AvatarViewer from './AvatarViewer';

const AvatarSelectionModal = ({ isOpen, onClose, avatarIndex }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>아바타 확인</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>생성된 아바타가 정확한지 확인해주세요.</Text>
          <AvatarViewer avatarIndex={avatarIndex} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AvatarSelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  avatarIndex: PropTypes.number.isRequired,
};

export default AvatarSelectionModal;
