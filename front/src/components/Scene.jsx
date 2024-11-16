// src/components/Scene.jsx
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import AvatarModel from './AvatarModel';
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
  const MODEL_PATH =
    process.env.REACT_APP_MODEL_PATH || '/files/avatars/models';

  const TEST_MODEL_FILES = useMemo(
    () => ({
      body: {
        obj: `/files/avatars/models/body_0_${gender}_pant.obj`,
        mtl: null,
      },
      tshirt: {
        obj: `/files/avatars/models/garment_0_${gender}_t-shirt.obj`,
        texture: `/textures/${
          gender === 'male' ? 'm_' : ''
        }t-shirt_texture1.png`,
      },
      pants: {
        obj: `/files/avatars/models/garment_0_${gender}_pant.obj`,
        texture: `/textures/${gender === 'male' ? 'm_' : ''}pants_texture1.png`,
      },
      shortPants: {
        obj: `/files/avatars/models/garment_0_${gender}_short-pant.obj`,
        texture: `/textures/${
          gender === 'male' ? 'm_' : ''
        }short-pants_texture1.png`,
      },
      shirt: {
        obj: `/files/avatars/models/garment_0_${gender}_shirt.obj`,
        texture: `/textures/${gender === 'male' ? 'm_' : ''}shirt_texture1.png`,
      },
      skirt: {
        obj: `/files/avatars/models/garment_0_${gender}_skirt.obj`,
        texture: `/textures/${gender === 'male' ? 'm_' : ''}skirt_texture1.png`,
      },
    }),
    [gender]
  );

  const hasRealModel = clo_3d && Object.keys(clo_3d).length > 0;
  const currentModels = hasRealModel ? clo_3d : TEST_MODEL_FILES;

  console.log('Scene rendering:', {
    hasRealModel,
    gender,
    avatarIndex,
    modelType: hasRealModel ? 'Real Model' : 'Test Model',
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

      <AvatarModel
        modelUrl={currentModels.body.obj}
        mtlUrl={currentModels.body?.mtl ?? null}
        textureUrl={null}
        showClothing={true}
        modelType="body"
      />

      {showClothing && currentModels.tshirt && (
        <AvatarModel
          modelUrl={currentModels.tshirt.obj}
          textureUrl={currentModels.tshirt.texture}
          showClothing={true}
          modelType="tshirt"
        />
      )}

      {showPants && currentModels.pants && (
        <AvatarModel
          modelUrl={currentModels.pants.obj}
          textureUrl={currentModels.pants.texture}
          showClothing={true}
          modelType="pants"
        />
      )}

      {showShortPants && currentModels.shortPants && (
        <AvatarModel
          modelUrl={currentModels.shortPants.obj}
          textureUrl={currentModels.shortPants.texture}
          showClothing={true}
          modelType="shortPants"
        />
      )}

      {showShirt && currentModels.shirt && (
        <AvatarModel
          modelUrl={currentModels.shirt.obj}
          textureUrl={currentModels.shirt.texture}
          showClothing={true}
          modelType="shirt"
        />
      )}

      {gender === 'female' && showSkirt && currentModels.skirt && (
        <AvatarModel
          modelUrl={currentModels.skirt.obj}
          textureUrl={currentModels.skirt.texture}
          showClothing={true}
          modelType="skirt"
        />
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
