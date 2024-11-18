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
  showPant,
  showShortPant,
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
    showPant,
    showShortPant,
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

      {/* Body */}
      <ErrorBoundary>
        <AvatarModel
          modelUrl={currentModels.body.obj}
          mtlUrl={currentModels.body.mtl || null}
          textureUrl={currentModels.body.tex || null}
          showClothing={true}
          modelType="body"
        />
      </ErrorBoundary>

      {/* Shirt */}
      {showShirt && currentModels.shirt && currentModels.shirt.obj && (
        <ErrorBoundary>
          <AvatarModel
            modelUrl={currentModels.shirt.obj}
            mtlUrl={currentModels.shirt.mtl || null}
            textureUrl={currentModels.shirt.tex || null}
            showShirt={showShirt}
            modelType="shirt"
          />
        </ErrorBoundary>
      )}

      {/* T-shirt */}
      {showClothing && currentModels.tshirt && currentModels.tshirt.obj && (
        <ErrorBoundary>
          <AvatarModel
            modelUrl={currentModels.tshirt.obj}
            mtlUrl={currentModels.tshirt.mtl || null}
            textureUrl={currentModels.tshirt.tex || null}
            showClothing={showClothing}
            modelType="tshirt"
          />
        </ErrorBoundary>
      )}

      {/* Pant */}
      {showPant && currentModels.pant && currentModels.pant.obj && (
        <ErrorBoundary>
          <AvatarModel
            modelUrl={currentModels.pant.obj}
            mtlUrl={currentModels.pant.mtl || null}
            textureUrl={currentModels.pant.tex || null}
            showPant={showPant}
            modelType="pant"
          />
        </ErrorBoundary>
      )}

      {/* Short Pant */}
      {showShortPant &&
        currentModels.shortPant &&
        currentModels.shortPant.obj && (
          <ErrorBoundary>
            <AvatarModel
              modelUrl={currentModels.shortPant.obj}
              mtlUrl={currentModels.shortPant.mtl || null}
              textureUrl={currentModels.shortPant.tex || null}
              showShortPant={showShortPant}
              modelType="shortPant"
            />
          </ErrorBoundary>
        )}

      {/* Skirt */}
      {gender === 'female' &&
        showSkirt &&
        currentModels.skirt &&
        currentModels.skirt.obj && (
          <ErrorBoundary>
            <AvatarModel
              modelUrl={currentModels.skirt.obj}
              mtlUrl={currentModels.skirt.mtl || null}
              textureUrl={currentModels.skirt.tex || null}
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
  showPant: PropTypes.bool,
  showShortPant: PropTypes.bool,
  showShirt: PropTypes.bool,
  showSkirt: PropTypes.bool,
  gender: PropTypes.string.isRequired,
  clo_3d: PropTypes.object,
  avatarIndex: PropTypes.number,
};

export default Scene;
