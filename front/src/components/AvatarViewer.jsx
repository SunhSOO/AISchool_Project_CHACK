// src/components/AvatarViewer.js
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Environment는 Scene.jsx에서 이미 import됨
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  IconButton,
  Box,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { FaCamera, FaRedo, FaBook } from 'react-icons/fa';
import Scene from './Scene';
import CaptureGuide from './CaptureGuide';
import Loader from './Loader';

/**
 * AvatarViewer 컴포넌트는 전체 뷰어를 구성하며, 슬라이더를 통해 아바타와 티셔츠의 크기를 조절할 수 있습니다.
 *
 * Props:
 * - onCaptureClick: 캡처 버튼 클릭 시 호출되는 함수
 * - onRetakeClick: 재촬영 버튼 클릭 시 호출되는 함수
 */
const AvatarViewer = ({ onCaptureClick, onRetakeClick }) => {
  const [scale, setScale] = useState(1); // 아바타와 티셔츠의 스케일 상태
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleGuideClick = () => {
    onOpen();
  };

  return (
    <Box position="relative" width="100%" height="60vh" zIndex={1}>
      {/* 컨트롤 버튼들 */}
      <Flex
        position="absolute"
        top={2}
        left="50%"
        transform="translateX(-50%)"
        zIndex={2}
        gap={2}
      >
        <IconButton
          icon={<FaCamera />}
          aria-label="Capture"
          onClick={onCaptureClick}
          colorScheme="red"
          borderRadius="full"
          bg="red.500"
          color="white"
          _hover={{ bg: 'red.600' }}
        />
        <IconButton
          icon={<FaRedo />}
          aria-label="Retake"
          onClick={onRetakeClick}
          colorScheme="red"
          borderRadius="full"
          bg="red.500"
          color="white"
          _hover={{ bg: 'red.600' }}
        />
        <IconButton
          icon={<FaBook />}
          aria-label="Guide"
          onClick={handleGuideClick}
          colorScheme="red"
          borderRadius="full"
          bg="red.500"
          color="white"
          _hover={{ bg: 'red.600' }}
        />
      </Flex>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 1000 }}
        style={{
          background: '#f0f0f0',
          borderRadius: 'xl',
          overflow: 'hidden',
        }}
      >
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minDistance={3}
          maxDistance={7}
          target={[0, 0, 0]}
        />
        <Suspense fallback={<Loader />}>
          <Scene scale={scale} />
        </Suspense>
      </Canvas>

      {/* 스케일 슬라이더 */}
      <Box
        spacing={4}
        position="absolute"
        bottom={4}
        left={4}
        zIndex={2}
        bg="rgba(255, 255, 255, 0.8)" // 배경 불투명도 조절
        p={4}
        borderRadius="xl"
        width="200px"
        align="start"
      >
        <Text fontSize="sm" fontWeight="bold" textAlign="left" mb={2}>
          아바타 및 티셔츠 크기
        </Text>
        <Slider
          value={scale}
          min={0.5}
          max={2}
          step={0.01}
          onChange={(value) => setScale(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      {/* 가이드 모달 */}
      <CaptureGuide isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default AvatarViewer;
