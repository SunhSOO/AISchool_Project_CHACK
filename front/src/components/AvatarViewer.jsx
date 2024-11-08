import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { IconButton, Box, useDisclosure, Flex } from '@chakra-ui/react';
import { FaCamera, FaRedo, FaBook } from 'react-icons/fa';
import Scene from './Scene';
import CaptureGuide from './CaptureGuide';
import Loader from './Loader';

const AvatarViewer = ({
  showAvatar = true,
  showClothing = false,
  showPants = false,
  showShortPants = false,
  showShirt = false,
  showSkirt = false,
  onCaptureClick = () => console.log('Capture clicked'),
  onRetakeClick = () => console.log('Retake clicked'),
  onGuideClick = () => console.log('Guide clicked'),
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log('AvatarViewer rendering with:', {
    showAvatar,
    showClothing,
    showPants,
    showShortPants,
    showShirt,
    showSkirt,
  });

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
          colorScheme="red"
          size="lg"
          borderRadius="full"
        />
        <IconButton
          icon={<FaRedo />}
          aria-label="Retake"
          onClick={onRetakeClick}
          colorScheme="red"
          size="lg"
          borderRadius="full"
        />
        <IconButton
          icon={<FaBook />}
          aria-label="Guide"
          onClick={onOpen}
          colorScheme="red"
          size="lg"
          borderRadius="full"
        />
      </Flex>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 0.5, 3],
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minDistance={2}
          maxDistance={6}
          target={[0, 0, 0]}
        />

        <Suspense fallback={<Loader />}>
          <Scene
            showAvatar={showAvatar}
            showClothing={showClothing}
            showPants={showPants}
            showShortPants={showShortPants}
            showShirt={showShirt}
            showSkirt={showSkirt}
          />
        </Suspense>
      </Canvas>

      {/* 가이드 모달 */}
      <CaptureGuide isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default AvatarViewer;
