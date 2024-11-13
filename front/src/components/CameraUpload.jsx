// src/components/CameraUpload.jsx

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Alert,
  AlertDescription,
  VStack,
  useToast,
  IconButton,
  Image,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCcw, FileText, Check } from 'lucide-react';
import CaptureGuide from './CaptureGuide';

const CameraUpload = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const toast = useToast();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const startCamera = async () => {
    try {
      // 기존 스트림이 있는 경우 중지
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const videoConstraints = isMobile
        ? {
            facingMode: 'environment', // { exact: 'environment' }에서 'environment'로 변경
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight },
          }
        : {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          };

      console.log('카메라 시작 시도...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      console.log('스트림 획득:', stream);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.error('비디오 재생 오류:', e);
          throw new Error('비디오를 시작할 수 없습니다.');
        }
      }
    } catch (err) {
      console.error('카메라 오류:', err);
      let errorMessage = '카메라를 시작할 수 없습니다.';

      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        errorMessage =
          '카메라 접근 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
      } else if (err.name === 'NotFoundError') {
        errorMessage =
          '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
      } else if (err.name === 'NotReadableError') {
        errorMessage =
          '카메라에 접근할 수 없습니다. 다른 앱이 카메라를 사용 중인지 확인해주세요.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage =
          '요청한 카메라 설정을 만족하는 장치를 찾을 수 없습니다. 설정을 확인해주세요.';
      }

      setError(errorMessage);
      toast({
        title: '카메라 오류',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
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

    const previewUrl = canvas.toDataURL('image/jpeg');
    setImagePreviewUrl(previewUrl);

    canvas.toBlob(
      (blob) => {
        setCapturedImage(blob);
        stopCamera();
      },
      'image/jpeg',
      0.95
    );
  };

  const handleConfirmAndUpload = async () => {
    if (!capturedImage) {
      toast({
        title: '촬영 필요',
        description: '먼저 이미지를 촬영해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('img_file', capturedImage, 'capture.jpg');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인 상태를 확인해주세요.');
      }

      // API URL 설정
      const apiUrl = 'http://localhost:8000/avatars';

      // API URL 확인
      console.log('Uploading to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // credentials: 'include', // 쿠키 포함 (필요에 따라 제거 가능)
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response:', responseText);

        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || '업로드 실패';
        } catch (e) {
          errorMessage = '서버 응답 처리 중 오류가 발생했습니다';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('업로드된 데이터:', data);

      toast({
        title: '업로드 성공',
        description: '이미지가 성공적으로 업로드되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/avatar');
    } catch (err) {
      console.error('업로드 오류:', err);
      setError('이미지 업로드 중 오류가 발생했습니다: ' + err.message);
      toast({
        title: '업로드 오류',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setImagePreviewUrl(null);
    setIsCameraStarted(false);
  };

  const handleStartCamera = () => {
    startCamera();
    setIsCameraStarted(true);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Box p={4} mt={12} maxW="md" mx="auto">
      {error && (
        <Alert status="error" mb={4}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VStack spacing={4} position="relative" alignItems="center">
        <Box
          w="100%"
          h={{
            base: '500px', // 모바일
            sm: '550px', // 작은 태블릿
            md: '600px', // 태블릿
            lg: '650px', // 데스크톱
            xl: '650px', // 큰 화면
          }}
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          bg="black"
        >
          {!imagePreviewUrl ? (
            isCameraStarted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Flex
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                bg="black"
              >
                <Button
                  onClick={handleStartCamera}
                  variant="outline"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  leftIcon={<Camera color="white" size={20} />}
                >
                  카메라 시작
                </Button>
              </Flex>
            )
          ) : (
            <Image
              src={imagePreviewUrl}
              alt="촬영된 이미지"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          )}

          <Flex
            position="absolute"
            bottom="20px"
            left="50%"
            transform="translateX(-50%)"
            justifyContent="center"
            alignItems="center"
            gap={6}
            bg="rgba(0, 0, 0, 0.5)"
            p={3}
            borderRadius="full"
            width="auto"
          >
            <IconButton
              onClick={() => setIsGuideOpen(true)}
              variant="ghost"
              _hover={{ bg: 'whiteAlpha.200' }}
              icon={<FileText color="white" size={24} />}
              aria-label="가이드"
              size="lg"
            />

            {!capturedImage ? (
              <IconButton
                onClick={captureImage}
                isDisabled={isLoading} // videoRef.current?.srcObject 조건 제거
                variant="ghost"
                _hover={{ bg: 'whiteAlpha.200' }}
                icon={<Camera color="white" size={24} />}
                aria-label="촬영"
                size="lg"
              />
            ) : (
              <IconButton
                onClick={resetCapture}
                variant="ghost"
                _hover={{ bg: 'whiteAlpha.200' }}
                icon={<RotateCcw color="white" size={24} />}
                aria-label="다시 촬영"
                size="lg"
                isDisabled={isLoading}
              />
            )}

            <IconButton
              onClick={handleConfirmAndUpload}
              variant="ghost"
              _hover={{ bg: 'whiteAlpha.200' }}
              icon={<Check color="white" size={24} />}
              aria-label="확인"
              size="lg"
              isDisabled={isLoading || !capturedImage}
            />
          </Flex>
        </Box>
      </VStack>

      <CaptureGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {isLoading && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          color="white"
          bg="rgba(0, 0, 0, 0.7)"
          p={3}
          borderRadius="md"
          zIndex="modal"
        >
          업로드 중...
        </Box>
      )}
    </Box>
  );
};

export default CameraUpload;
