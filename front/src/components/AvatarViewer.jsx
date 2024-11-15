import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Text, Flex, Spinner } from '@chakra-ui/react';
import Scene from './Scene';
import Loader from './Loader';
import { useClothing } from '../contexts/ClothingContext';
import { getAvatarData } from '../services/api';

const AvatarViewer = () => {
  const { activeClothing, updateClothing } = useClothing();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAvatarData = async () => {
      try {
        const data = await getAvatarData();
        console.log('Loaded avatar data:', data);

        updateClothing({
          avatarIndex: data.avatarIndex,
          gender: data.gender,
          clo_3d: data.clo_3d,
        });
      } catch (error) {
        console.error('아바타 로드 실패:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatarData();
  }, [updateClothing]);

  if (isLoading) {
    return (
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        color="red.500"
      >
        <Text>{error}</Text>
      </Flex>
    );
  }

  return (
    <Box position="relative" width="100%" height="100%" zIndex={1}>
      {!activeClothing.clo_3d && (
        <Flex
          position="absolute"
          top="20px"
          right="20px"
          zIndex={2}
          bg="blue.500"
          color="white"
          px={4}
          py={2}
          borderRadius="md"
          alignItems="center"
          boxShadow="lg"
        >
          <Text fontSize="sm" fontWeight="medium">
            아바타를 생성 중입니다...
          </Text>
        </Flex>
      )}

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
          minDistance={1.5}
          maxDistance={4}
          target={[0, 0, 0]}
        />

        <Suspense fallback={<Loader />}>
          <Scene
            showAvatar={true}
            showClothing={activeClothing.showClothing}
            showPants={activeClothing.showPants}
            showShortPants={activeClothing.showShortPants}
            showShirt={activeClothing.showShirt}
            showSkirt={activeClothing.showSkirt}
            gender={activeClothing.gender}
            clo_3d={activeClothing.clo_3d}
            avatarIndex={activeClothing.avatarIndex}
          />
        </Suspense>
      </Canvas>
    </Box>
  );
};

export default AvatarViewer;
