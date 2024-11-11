import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Alert,
  AlertDescription,
  VStack,
  useToast,
} from '@chakra-ui/react';

const CameraUpload = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const toast = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('카메라를 시작할 수 없습니다.');
      toast({
        title: '카메라 오류',
        description: '카메라를 시작할 수 없습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      setCapturedImage(blob);
      stopCamera();
      await uploadImage(blob);
    }, 'image/jpeg');
  };

  const uploadImage = async (blob) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const data = await response.json();
      toast({
        title: '업로드 성공',
        description: '이미지가 성공적으로 업로드되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError('이미지 업로드 중 오류가 발생했습니다.');
      toast({
        title: '업로드 오류',
        description: '이미지 업로드 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      {error && (
        <Alert status="error" mb={4}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VStack spacing={4}>
        <Box
          w="100%"
          maxW="md"
          h="400px"
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          bg="gray.100"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        <Flex gap={4} justifyContent="center" w="100%">
          {!capturedImage ? (
            <>
              <Button
                onClick={startCamera}
                colorScheme="blue"
                isDisabled={isLoading}
                leftIcon={<Box as="span">📷</Box>}
              >
                카메라 시작
              </Button>
              <Button
                onClick={captureImage}
                colorScheme="green"
                isDisabled={!videoRef.current || isLoading}
              >
                업로드
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setCapturedImage(null);
                startCamera();
              }}
              colorScheme="gray"
              isDisabled={isLoading}
            >
              다시 촬영
            </Button>
          )}
        </Flex>

        {isLoading && (
          <Box textAlign="center" color="gray.600">
            처리중...
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CameraUpload;
