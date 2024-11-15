// src/components/CameraUpload.jsx
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
import { uploadImage } from '../services/api';
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
      // 파일 확장자 검사 (.jpg만 허용)
      if (file.type !== 'image/jpeg') {
        setError('JPEG 형식의 이미지만 업로드할 수 있습니다.');
        setSelectedImage(null);
        setImagePreviewUrl(null);
        return;
      }

      // 파일 크기 제한 (예: 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        setError('파일 크기는 5MB를 초과할 수 없습니다.');
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

  // 모바일 환경: 웹캠 시작
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
        description: '카메라에 접근할 수 없습니다. 권한을 확인해주세요.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      fileInputRef.current?.click();
    }
  };

  // 모바일 환경: 웹캠 중지
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

  // 모바일 환경: 이미지 캡처
  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const desiredWidth = 800; // 원하는 너비로 조정 (예: 800px)
    const scale = desiredWidth / videoRef.current.videoWidth;
    canvas.width = desiredWidth;
    canvas.height = videoRef.current.videoHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          // .jpg 확장자를 가진 File 객체 생성
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setImagePreviewUrl(canvas.toDataURL('image/jpeg'));
          stopCamera();
          console.log('Captured Image Size:', file.size, 'bytes'); // 이미지 크기 로그
        }
      },
      'image/jpeg',
      0.7 // 압축률을 높여 파일 크기 줄이기 (0.0 ~ 1.0)
    );
  };

  // 이미지 업로드 핸들러 (모바일과 웹 공통)
  const handleConfirmAndUpload = async () => {
    if (!selectedImage) {
      toast({
        title: '촬영 또는 업로드 필요',
        description: '먼저 이미지를 촬영하거나 업로드해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadImage(selectedImage);

      // 응답 로그 추가 (디버깅 용도)
      console.log('Upload Result:', result);

      // 컨텍스트 업데이트
      updateMeasurements({
        avatarIndex: result.avatar_idx, // 백엔드에서 avatar_idx 반환 시
        gender: result.gender || 'female', // 백엔드에서 gender 반환 시
      });

      toast({
        title: '업로드 성공',
        description: '이미지가 성공적으로 업로드되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 로딩 상태 해제 후 측정 페이지로 이동
      setIsLoading(false);
      navigate('/measurement-form');
    } catch (err) {
      console.error('이미지 업로드 오류:', err);
      setError('이미지 업로드 중 오류가 발생했습니다.');
      toast({
        title: '업로드 실패',
        description: err.message || '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} mt={12} maxW="md" mx="auto">
      {/* 파일 입력 (웹 환경, 숨김) */}
      <Input
        type="file"
        accept="image/jpeg"
        ref={fileInputRef}
        onChange={handleFileChange}
        display="none"
      />

      {/* 에러 메시지 */}
      {error && (
        <Alert status="error" mb={4}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VStack spacing={4} align="center">
        {/* 이미지 프리뷰 또는 웹캠 */}
        {imagePreviewUrl ? (
          <Box
            w="100%"
            h="400px"
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
          // 모바일 환경: 웹캠 UI 유지
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

            {/* 제어 버튼들 */}
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
          // 웹 환경: 이미지 업로드 UI 추가
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
                클릭하여 JPEG 이미지 업로드
              </Text>
            </Flex>
          </Box>
        )}

        {/* 업로드 버튼 (웹 환경) */}
        {!imagePreviewUrl && !isMobile && (
          <Button
            colorScheme="blue"
            leftIcon={<Upload />}
            onClick={triggerFileSelect}
          >
            이미지 업로드
          </Button>
        )}

        {/* 가이드 버튼 (모바일 환경) */}
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

      {/* 가이드 모달 */}
      <CaptureGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 업로드 중 표시 */}
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

// // src/components/CameraUpload.jsx

// import React, { useRef, useState, useEffect } from 'react';
// import {
//   Box,
//   Flex,
//   Alert,
//   AlertDescription,
//   VStack,
//   useToast,
//   IconButton,
//   Image,
//   Button,
//   Icon,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { Camera, RotateCcw, FileText, Check } from 'lucide-react';
// import CaptureGuide from './CaptureGuide';
// import { FiCamera } from 'react-icons/fi'; // 카메라 아이콘 불러오기

// const CameraUpload = () => {
//   const navigate = useNavigate();
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isGuideOpen, setIsGuideOpen] = useState(false);
//   const [isCameraStarted, setIsCameraStarted] = useState(false);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const toast = useToast();

//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//   // iOS 체크 (Chrome 포함)
//   const isIOS =
//     /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

//   // iOS Chrome 체크
//   const isIOSChrome = isIOS && /CriOS/.test(navigator.userAgent);

//   const [isAvatarVisible, setIsAvatarVisible] = useState(true);

//   const imageInput = useRef();

//   const handleCapture = (event) => {
//     toast({
//       title: 'TEst',
//       description: 'test1',
//     });
//     const file = event.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setCapturedImage(imageUrl);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       setError(null);

//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }

//       let videoConstraints;

//       //모바일 인지 웹인지 구분
//       if (isIOS) {
//         console.log('test1');
//         imageInput.current.click();
//       } else {
//         videoConstraints = {
//           facingMode: isMobile ? { ideal: 'environment' } : 'user',
//           width: { ideal: window.innerWidth },
//           height: { ideal: window.innerHeight },
//         };

//         try {
//           // 브라우저가 mediaDevices와 getUserMedia를 지원하는지 확인
//           let stream = null;
//           console.log(navigator.mediaDevices);
//           if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//             const msg =
//               '브라우저가 카메라 기능을 지원하지 않습니다. 최신 브라우저를 사용해주세요.';
//             setError(msg);
//             toast({
//               title: '지원되지 않는 브라우저',
//               description: msg,
//               status: 'error',
//               duration: 5000,
//               isClosable: true,
//             });
//           } else {
//             stream = await navigator.mediaDevices.getUserMedia({
//               video: videoConstraints,
//               audio: false,
//             });
//           }

//           if (!videoRef.current) return;

//           videoRef.current.setAttribute('playsinline', 'true');
//           videoRef.current.setAttribute('webkit-playsinline', 'true');
//           videoRef.current.srcObject = stream;

//           await videoRef.current.play();
//           streamRef.current = stream;
//           setIsCameraStarted(true);
//         } catch (err) {
//           if (err.name === 'TypeError') {
//             setError(
//               '지원되지 않는 브라우저입니다. Safari 또는 Chrome의 최신 버전을 사용해 주세요.'
//             );
//           } else {
//             setError(`카메라 접근 실패: ${err.message}`);
//           }
//           setIsCameraStarted(false);
//           console.error('getUserMedia error:', err);
//         }
//       }
//     } catch (err) {
//       console.error('Camera error:', err);
//       setError('카메라를 시작할 수 없습니다.');
//     }
//   };

//   // 원래
//   // const startCamera = async () => {
//   //   try {
//   //     // 기존 스트림이 있는 경우 중지
//   //     if (streamRef.current) {
//   //       streamRef.current.getTracks().forEach((track) => track.stop());
//   //     }

//   //     const videoConstraints = isMobile
//   //       ? {
//   //           facingMode: 'environment', // { exact: 'environment' }에서 'environment'로 변경
//   //           width: { ideal: window.innerWidth },
//   //           height: { ideal: window.innerHeight },
//   //         }
//   //       : {
//   //           facingMode: 'user',
//   //           width: { ideal: 1280 },
//   //           height: { ideal: 720 },
//   //         };

//   //     console.log('카메라 시작 시도...');
//   //     const stream = await navigator.mediaDevices.getUserMedia({
//   //       video: videoConstraints,
//   //       audio: false,
//   //     });

//   //     toast({
//   //       title: '카메라 오류',
//   //       description: 'test1',
//   //     });

//   //     console.log('스트림 획득:', stream);
//   //     streamRef.current = stream;

//   //     if (videoRef.current) {
//   //       videoRef.current.srcObject = stream;
//   //       try {
//   //         await videoRef.current.play();
//   //       } catch (e) {
//   //         console.error('비디오 재생 오류:', e);
//   //         throw new Error('비디오를 시작할 수 없습니다.');
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error('카메라 오류:', err);
//   //     let errorMessage = '카메라를 시작할 수 없습니다.';

//   //     if (
//   //       err.name === 'NotAllowedError' ||
//   //       err.name === 'PermissionDeniedError'
//   //     ) {
//   //       errorMessage =
//   //         '카메라 접근 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
//   //     } else if (err.name === 'NotFoundError') {
//   //       errorMessage =
//   //         '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
//   //     } else if (err.name === 'NotReadableError') {
//   //       errorMessage =
//   //         '카메라에 접근할 수 없습니다. 다른 앱이 카메라를 사용 중인지 확인해주세요.';
//   //     } else if (err.name === 'OverconstrainedError') {
//   //       errorMessage =
//   //         '요청한 카메라 설정을 만족하는 장치를 찾을 수 없습니다. 설정을 확인해주세요.';
//   //     }

//   //     setError(errorMessage);
//   //     toast({
//   //       title: '카메라 오류',
//   //       description: err.name,
//   //       status: 'error',
//   //       duration: 5000,
//   //       isClosable: true,
//   //     });
//   //   }
//   // };
//   ////

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//   };

//   const captureImage = () => {
//     if (!videoRef.current) return;

//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(videoRef.current, 0, 0);

//     const previewUrl = canvas.toDataURL('image/jpeg');
//     setImagePreviewUrl(previewUrl);

//     canvas.toBlob(
//       (blob) => {
//         setCapturedImage(blob);
//         stopCamera();
//       },
//       'image/jpeg',
//       0.95
//     );
//   };

//   const handleConfirmAndUpload = async () => {
//     if (!capturedImage) {
//       toast({
//         title: '촬영 필요',
//         description: '먼저 이미지를 촬영해주세요.',
//         status: 'warning',
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append('img_file', capturedImage, 'capture.jpg');

//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('인증 토큰이 없습니다. 로그인 상태를 확인해주세요.');
//       }

//       // API URL 설정
//       const apiUrl = 'https://0df700645a97.ngrok.app/avatars';

//       // API URL 확인
//       console.log('Uploading to:', apiUrl);

//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         // credentials: 'include', // 쿠키 포함 (필요에 따라 제거 가능)
//         body: formData,
//       });

//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         const responseText = await response.text();
//         console.error('Error response:', responseText);

//         let errorMessage;
//         try {
//           const errorData = JSON.parse(responseText);
//           errorMessage = errorData.detail || '업로드 실패';
//         } catch (e) {
//           errorMessage = '서버 응답 처리 중 오류가 발생했습니다';
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       console.log('업로드된 데이터:', data);

//       toast({
//         title: '업로드 성공',
//         description: '이미지가 성공적으로 업로드되었습니다.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       navigate('/avatar');
//     } catch (err) {
//       console.error('업로드 오류:', err);
//       setError('이미지 업로드 중 오류가 발생했습니다: ' + err.message);
//       toast({
//         title: '업로드 오류',
//         description: err.message,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetCapture = () => {
//     setCapturedImage(null);
//     setImagePreviewUrl(null);
//     setIsCameraStarted(false);
//   };

//   const handleStartCamera = () => {
//     startCamera();
//     setIsCameraStarted(true);
//   };

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   return (
//     <Box p={4} mt={12} maxW="md" mx="auto">
//       {error && (
//         <Alert status="error" mb={4}>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <VStack spacing={4} position="relative" alignItems="center">
//         <Box
//           w="100%"
//           h={{
//             base: '500px', // 모바일
//             sm: '550px', // 작은 태블릿
//             md: '600px', // 태블릿
//             lg: '650px', // 데스크톱
//             xl: '650px', // 큰 화면
//           }}
//           position="relative"
//           borderRadius="lg"
//           overflow="hidden"
//           bg="black"
//         >
//           {!imagePreviewUrl ? (
//             isCameraStarted ? (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'cover',
//                 }}
//               />
//             ) : (
//               <Flex
//                 width="100%"
//                 height="100%"
//                 justifyContent="center"
//                 alignItems="center"
//                 bg="black"
//               >
//                 <Button
//                   onClick={handleStartCamera}
//                   variant="outline"
//                   colorScheme="whiteAlpha"
//                   size="lg"
//                   _hover={{ bg: 'whiteAlpha.200' }}
//                   leftIcon={<Camera color="white" size={20} />}
//                 >
//                   카메라 시작
//                 </Button>

//                 {/* 이미지 내부 하단 가운데에 카메라 버튼 */}
//                 <Button
//                   bg="white"
//                   borderRadius="full"
//                   boxShadow="md"
//                   _hover={{ bg: 'gray.100' }}
//                   size="lg" // 버튼 크기 증가
//                   position="absolute"
//                   bottom="10px"
//                   left="50%"
//                   transform="translateX(-50%)"
//                   zIndex="2"
//                   width="200px" // 버튼의 폭을 키움
//                   height="60px" // 버튼의 높이를 키움
//                   display="none"
//                 >
//                   <Icon as={FiCamera} w={8} h={8} color="black" />{' '}
//                   {/* 아이콘 크기를 증가 */}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     capture="environment"
//                     ref={imageInput}
//                     onChange={handleCapture}
//                     style={{
//                       position: 'absolute',
//                       opacity: 0,
//                       width: '100%',
//                       height: '100%',
//                       cursor: 'pointer',
//                     }}
//                   />
//                 </Button>
//               </Flex>
//             )
//           ) : (
//             <Image
//               src={imagePreviewUrl}
//               alt="촬영된 이미지"
//               w="100%"
//               h="100%"
//               objectFit="cover"
//             />
//           )}

//           <Flex
//             position="absolute"
//             bottom="20px"
//             left="50%"
//             transform="translateX(-50%)"
//             justifyContent="center"
//             alignItems="center"
//             gap={6}
//             bg="rgba(0, 0, 0, 0.5)"
//             p={3}
//             borderRadius="full"
//             width="auto"
//           >
//             <IconButton
//               onClick={() => setIsGuideOpen(true)}
//               variant="ghost"
//               _hover={{ bg: 'whiteAlpha.200' }}
//               icon={<FileText color="white" size={24} />}
//               aria-label="가이드"
//               size="lg"
//             />

//             {!capturedImage ? (
//               <IconButton
//                 onClick={captureImage}
//                 isDisabled={isLoading} // videoRef.current?.srcObject 조건 제거
//                 variant="ghost"
//                 _hover={{ bg: 'whiteAlpha.200' }}
//                 icon={<Camera color="white" size={24} />}
//                 aria-label="촬영"
//                 size="lg"
//               />
//             ) : (
//               <IconButton
//                 onClick={resetCapture}
//                 variant="ghost"
//                 _hover={{ bg: 'whiteAlpha.200' }}
//                 icon={<RotateCcw color="white" size={24} />}
//                 aria-label="다시 촬영"
//                 size="lg"
//                 isDisabled={isLoading}
//               />
//             )}

//             <IconButton
//               onClick={handleConfirmAndUpload}
//               variant="ghost"
//               _hover={{ bg: 'whiteAlpha.200' }}
//               icon={<Check color="white" size={24} />}
//               aria-label="확인"
//               size="lg"
//               isDisabled={isLoading || !capturedImage}
//             />
//           </Flex>
//         </Box>
//       </VStack>

//       <CaptureGuide
//         isOpen={isGuideOpen}
//         onClose={() => setIsGuideOpen(false)}
//       />

//       {isLoading && (
//         <Box
//           position="fixed"
//           top="50%"
//           left="50%"
//           transform="translate(-50%, -50%)"
//           textAlign="center"
//           color="white"
//           bg="rgba(0, 0, 0, 0.7)"
//           p={3}
//           borderRadius="md"
//           zIndex="modal"
//         >
//           업로드 중...
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default CameraUpload;

// src/components/CameraUpload.jsx
