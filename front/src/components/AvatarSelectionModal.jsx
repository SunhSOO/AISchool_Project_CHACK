// src/components/AvatarSelectionModal.jsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Grid,
  GridItem,
  Image,
  Text,
  Spinner,
  Alert,
  AlertDescription,
  useToast,
} from '@chakra-ui/react';
import { fetchModels } from '../services/api'; // 모델을 가져오는 API 함수
import { useMeasurements } from '../contexts/UserMeasurementContext';

const AvatarSelectionModal = ({ isOpen, onClose }) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateMeasurements } = useMeasurements();
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const getModels = async () => {
        try {
          const data = await fetchModels();
          setModels(data);
          setIsLoading(false);
        } catch (err) {
          setError('아바타 모델을 불러오는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      };

      getModels();
    }
  }, [isOpen]);

  const handleSelectModel = (model) => {
    // 선택된 모델을 컨텍스트에 저장
    updateMeasurements({ selectedModel: model });
    toast({
      title: `${model.name}을(를) 선택했습니다.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose(); // 모달 닫기
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>아바타 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Spinner size="xl" />
          ) : error ? (
            <Alert status="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Grid
              templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
              gap={6}
            >
              {models.map((model) => (
                <GridItem
                  key={model.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  p={2}
                >
                  <Image
                    src={model.image_url}
                    alt={model.name}
                    boxSize="150px"
                    objectFit="cover"
                  />
                  <Text mt={2} fontWeight="bold" textAlign="center">
                    {model.name}
                  </Text>
                  <Button
                    mt={2}
                    colorScheme="blue"
                    size="sm"
                    width="100%"
                    onClick={() => handleSelectModel(model)}
                  >
                    선택
                  </Button>
                </GridItem>
              ))}
            </Grid>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AvatarSelectionModal;
