import React, { useRef, useState } from 'react';
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
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCcw, Check, FileText, Upload } from 'lucide-react';
import { useMeasurements } from '../contexts/UserMeasurementContext';
import CaptureGuide from './CaptureGuide';

const CameraUpload = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { updateMeasurements } = useMeasurements();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // 디바이스 타입 감지
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // 웹 환경: 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 타입 검증 (이미지 파일만 허용)
      if (!file.type.includes('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        setSelectedImage(null);
        setImagePreviewUrl(null);
        return;
      }

      // 파일 크기 제한 (10MB)
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        setError('파일 크기는 10MB를 초과할 수 없습니다.');
        setSelectedImage(null);
        setImagePreviewUrl(null);
        return;
      }

      setError(null);
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // 웹 환경: 파일 선택 창 열기
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // 카메라 시작
  const startCamera = async () => {
    try {
      if (isIOS) {
        fileInputRef.current?.click();
        return;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const videoConstraints = {
        facingMode: isMobile ? 'environment' : 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.setAttribute('playsinline', 'true'); // iOS 호환성
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        setIsCameraStarted(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      toast({
        title: '카메라 접근 오류',
        description: '카메라에 접근할 수 없습니다. 갤러리에서 선택해주세요.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      fileInputRef.current?.click();
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraStarted(false);
  };

  // 이미지 캡처
  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setImagePreviewUrl(canvas.toDataURL('image/jpeg'));
          stopCamera();
          console.log('Captured Image Size:', file.size, 'bytes');
        }
      },
      'image/jpeg',
      0.95 // 높은 품질의 이미지 유지
    );
  };

  // 이미지 업로드 처리
  const handleConfirmAndUpload = async () => {
    if (!selectedImage) {
      toast({
        title: '이미지 필요',
        description: '먼저 이미지를 촬영하거나 선택해주세요.',
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
      formData.append('img_file', selectedImage, 'capture.jpg');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/avatars`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || '업로드 실패';
        } catch (e) {
          errorMessage = '서버 응답 처리 중 오류가 발생했습니다';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload Result:', result);

      updateMeasurements({
        avatarIndex: result.avatar_idx,
        gender: result.gender || 'female',
      });

      toast({
        title: '업로드 성공',
        description: '이미지가 성공적으로 업로드되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/measurement-form');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      toast({
        title: '업로드 실패',
        description: err.message || '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} mt={12} maxW="md" mx="auto">
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        display="none"
      />

      {error && (
        <Alert status="error" mb={4}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VStack spacing={4} align="center">
        {imagePreviewUrl ? (
          <Box
            w="100%"
            h="600px"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
          >
            <Image
              src={imagePreviewUrl}
              alt="선택된 이미지"
              objectFit="cover"
              w="100%"
              h="100%"
            />
            <Flex
              position="absolute"
              bottom="10px"
              left="50%"
              transform="translateX(-50%)"
              gap={4}
            >
              <IconButton
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreviewUrl(null);
                }}
                variant="ghost"
                colorScheme="red"
                icon={<RotateCcw />}
                aria-label="다시 선택"
              />
              <IconButton
                onClick={handleConfirmAndUpload}
                variant="ghost"
                colorScheme="green"
                icon={<Check />}
                aria-label="업로드"
                isLoading={isLoading}
              />
            </Flex>
          </Box>
        ) : isMobile ? (
          <Box
            w="100%"
            h="400px"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
          >
            {isCameraStarted ? (
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
                  onClick={startCamera}
                  variant="outline"
                  colorScheme="whiteAlpha"
                  size="lg"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  leftIcon={<Camera color="white" size={20} />}
                >
                  {isIOS ? '사진 선택' : '카메라 시작'}
                </Button>
              </Flex>
            )}

            {isCameraStarted && (
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

                <IconButton
                  onClick={captureImage}
                  isDisabled={!isCameraStarted || isLoading}
                  variant="ghost"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  icon={<Camera color="white" size={24} />}
                  aria-label="촬영"
                  size="lg"
                />

                <IconButton
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreviewUrl(null);
                    stopCamera();
                  }}
                  variant="ghost"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  icon={<RotateCcw color="white" size={24} />}
                  aria-label="다시 촬영"
                  size="lg"
                  isDisabled={isLoading}
                />

                <IconButton
                  onClick={handleConfirmAndUpload}
                  variant="ghost"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  icon={<Check color="white" size={24} />}
                  aria-label="업로드"
                  size="lg"
                  isDisabled={isLoading || !selectedImage}
                />
              </Flex>
            )}
          </Box>
        ) : (
          <Box
            w="100%"
            h="400px"
            border="2px dashed gray"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={triggerFileSelect}
          >
            <Flex direction="column" align="center">
              <Upload size={48} color="gray" />
              <Text mt={2} color="gray">
                클릭하여 이미지 업로드
              </Text>
            </Flex>
          </Box>
        )}

        {!imagePreviewUrl && !isMobile && (
          <Button
            colorScheme="blue"
            leftIcon={<Upload />}
            onClick={triggerFileSelect}
          >
            이미지 업로드
          </Button>
        )}

        {!imagePreviewUrl && isMobile && (
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => setIsGuideOpen(true)}
          >
            촬영 가이드 보기
          </Button>
        )}
      </VStack>

      <CaptureGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {isLoading && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          align="center"
          justify="center"
          zIndex="overlay"
        >
          <VStack bg="white" p={6} borderRadius="md" boxShadow="lg">
            <Spinner size="xl" />
            <Text>업로드 중...</Text>
          </VStack>
        </Flex>
      )}
    </Box>
  );
};

export default CameraUpload;
