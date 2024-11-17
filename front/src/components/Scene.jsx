// src/components/Scene.jsx

import React from 'react';
import { Environment } from '@react-three/drei';
import AvatarModel from './AvatarModel';
import ErrorBoundary from './ErrorBoundary';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';

const Scene = ({
  showAvatar,
  showClothing,
  showPants,
  showShortPants,
  showShirt,
  showSkirt,
  gender,
  clo_3d,
  avatarIndex,
}) => {
  const currentModels = clo_3d;

  console.log('Scene rendering:', {
    showAvatar,
    showClothing,
    showPants,
    showShortPants,
    showShirt,
    showSkirt,
    gender,
    avatarIndex,
    currentModels,
  });

  if (!currentModels.body || !currentModels.body.obj) {
    console.error('body.obj 경로가 설정되지 않았습니다.', currentModels);
    return (
      <Box>
        <Text color="red.500">바디 모델을 로드할 수 없습니다.</Text>
      </Box>
    );
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <spotLight
        position={[-5, 5, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        castShadow
      />
      <Environment preset="studio" />

      <ErrorBoundary>
        <AvatarModel
          modelUrl={currentModels.body.obj}
          mtlUrl={currentModels.body?.mtl ?? null}
          textureUrl={null}
          showClothing={true}
          modelType="body"
        />
      </ErrorBoundary>

      {showClothing && currentModels.tshirt && currentModels.tshirt.obj && (
        <ErrorBoundary>
          <AvatarModel
            modelUrl={currentModels.tshirt.obj}
            textureUrl={currentModels.tshirt.tex}
            showClothing={showClothing}
            modelType="tshirt"
          />
        </ErrorBoundary>
      )}

      {showPants && currentModels.pants && currentModels.pants.obj && (
        <ErrorBoundary>
          <AvatarModel
            modelUrl={currentModels.pants.obj}
            textureUrl={currentModels.pants.tex}
            showPants={showPants}
            modelType="pants"
          />
        </ErrorBoundary>
      )}

      {showShortPants &&
        currentModels.shortPants &&
        currentModels.shortPants.obj && (
          <ErrorBoundary>
            <AvatarModel
              modelUrl={currentModels.shortPants.obj}
              textureUrl={currentModels.shortPants.tex}
              showShortPants={showShortPants}
              modelType="shortPants"
            />
          </ErrorBoundary>
        )}

      {showShirt && currentModels.shirt && currentModels.shirt.obj && (
        <ErrorBoundary>
          <AvatarModel
            modelUrl={currentModels.shirt.obj}
            textureUrl={currentModels.shirt.tex}
            showShirt={showShirt}
            modelType="shirt"
          />
        </ErrorBoundary>
      )}

      {gender === 'female' &&
        showSkirt &&
        currentModels.skirt &&
        currentModels.skirt.obj && (
          <ErrorBoundary>
            <AvatarModel
              modelUrl={currentModels.skirt.obj}
              textureUrl={currentModels.skirt.tex}
              showSkirt={showSkirt}
              modelType="skirt"
            />
          </ErrorBoundary>
        )}
    </>
  );
};

Scene.propTypes = {
  showAvatar: PropTypes.bool,
  showClothing: PropTypes.bool,
  showPants: PropTypes.bool,
  showShortPants: PropTypes.bool,
  showShirt: PropTypes.bool,
  showSkirt: PropTypes.bool,
  gender: PropTypes.string.isRequired,
  clo_3d: PropTypes.object,
  avatarIndex: PropTypes.number,
};

export default Scene;
