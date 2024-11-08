// src/components/AvatarViewer.js

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
  const [scale, setScale] = useState(1.5); // 아바타와 티셔츠의 기본 스케일
  const { isOpen, onOpen, onClose } = useDisclosure(); // 모달 관리

  return (
    <Box position="relative" width="100%" height="60vh" zIndex={1}>
      {/* 상단 컨트롤 버튼 */}
      <Flex
        position="absolute"
        top={4}
        left="50%"
        transform="translateX(-50%)"
        zIndex={2}
        gap={4}
      >
        <IconButton
          icon={<FaCamera />}
          aria-label="Capture"
          onClick={onCaptureClick}
          colorScheme="teal"
          size="lg"
          borderRadius="full"
        />
        <IconButton
          icon={<FaRedo />}
          aria-label="Retake"
          onClick={onRetakeClick}
          colorScheme="teal"
          size="lg"
          borderRadius="full"
        />
        <IconButton
          icon={<FaBook />}
          aria-label="Guide"
          onClick={onOpen}
          colorScheme="teal"
          size="lg"
          borderRadius="full"
        />
      </Flex>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 0.5, 3], // 카메라 위치를 아바타를 잘 볼 수 있도록 조정
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: '#f0f0f0' }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* OrbitControls로 사용자 상호작용 가능하게 설정 */}
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minDistance={2}
          maxDistance={6}
          target={[0, 0, 0]} // 아바타의 중심을 바라보도록 설정
        />

        {/* Suspense를 사용하여 모델 로딩 중 로딩 컴포넌트 표시 */}
        <Suspense fallback={<Loader />}>
          <Scene scale={scale} />
        </Suspense>
      </Canvas>

      {/* 크기 조절 슬라이더 */}
      <Box
        position="absolute"
        bottom={4}
        left={4}
        zIndex={2}
        bg="rgba(255, 255, 255, 0.8)" // 배경 불투명도 조절
        p={4}
        borderRadius="xl"
        boxShadow="lg"
        width="200px"
      >
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          아바타 및 티셔츠 크기
        </Text>
        <Slider
          value={scale}
          min={0.5}
          max={2.5}
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
