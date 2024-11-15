// src/components/Scene.jsx
import React from 'react';
import { Environment } from '@react-three/drei';
import AvatarModel from './AvatarModel';

const Scene = ({
  showAvatar,
  showClothing,
  showPants,
  showShortPants,
  showShirt,
  showSkirt,
  gender = 'female',
  clo_3d,
  avatarIndex = '28',
}) => {
  // 실제 모델 경로
  const AVATAR_PATH = `${process.env.REACT_APP_API_URL}/uploads/avatars/models`;
  const CLOTHING_PATH = `${process.env.REACT_APP_API_URL}/uploads/fittings`;

  // 실제 모델 파일 구조
  const REAL_MODEL_FILES = {
    body: {
      obj: `${AVATAR_PATH}/body_${avatarIndex}_${gender}.obj`,
      mtl: null,
    },
    tshirt: {
      obj: `${CLOTHING_PATH}/garment_${avatarIndex}_${gender}_tshirt.obj`,
    },
    pants: {
      obj: `${CLOTHING_PATH}/garment_${avatarIndex}_${gender}_pants.obj`,
    },
    shortPants: {
      obj: `${CLOTHING_PATH}/garment_${avatarIndex}_${gender}_shortpants.obj`,
    },
    shirt: {
      obj: `${CLOTHING_PATH}/garment_${avatarIndex}_${gender}_shirt.obj`,
    },
    skirt:
      gender === 'female'
        ? {
            obj: `${CLOTHING_PATH}/garment_${avatarIndex}_${gender}_skirt.obj`,
          }
        : null,
  };

  // 테스트 모델 경로
  const MODEL_URL = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_MODEL_PATH}`;

  // 테스트 모델 파일 구조
  const TEST_MODEL_FILES = {
    female: {
      body: {
        obj: `${MODEL_URL}/body_apose.obj`,
        mtl: `${MODEL_URL}/body_A_pose.mtl`,
      },
      tshirt: {
        obj: `${MODEL_URL}/t-shirt_apose.obj`,
        texture: '/textures/t-shirt01.png',
      },
      pants: {
        obj: `${MODEL_URL}/pant_apose.obj`,
        texture: '/textures/pants_texture1.png',
      },
      shortPants: {
        obj: `${MODEL_URL}/short-pant_apose.obj`,
        texture: '/textures/short-pants_texture1.png',
      },
      shirt: {
        obj: `${MODEL_URL}/shirt_apose.obj`,
        texture: '/textures/shirt_texture1.png',
      },
      skirt: {
        obj: `${MODEL_URL}/skirt_apose.obj`,
        texture: '/textures/skirt_texture1.png',
      },
    },
    male: {
      body: {
        obj: `${MODEL_URL}/body_0_male_pant.obj`,
        mtl: null,
      },
      tshirt: {
        obj: `${MODEL_URL}/garment_0_male_t-shirt.obj`,
        texture: '/textures/m_t-shirt_texture1.png',
      },
      pants: {
        obj: `${MODEL_URL}/garment_0_male_pant.obj`,
        texture: '/textures/m_pants_texture1.png',
      },
      shortPants: {
        obj: `${MODEL_URL}/garment_0_male_short-pant.obj`,
        texture: '/textures/m_short-pants_texture1.png',
      },
      shirt: {
        obj: `${MODEL_URL}/garment_0_male_shirt.obj`,
        texture: '/textures/m_shirt_texture1.png',
      },
    },
  };

  const hasRealModel = clo_3d && Object.keys(clo_3d).length > 0;
  // 현재 사용할 모델 선택
  const currentModels = hasRealModel ? clo_3d : TEST_MODEL_FILES[gender];

  console.log('Scene rendering:', {
    hasRealModel,
    gender,
    modelType: hasRealModel ? 'Real Model' : 'Test Model',
    currentModels,
  });

  return (
    <>
      <Environment preset="studio" />

      {/* Avatar Body */}
      <AvatarModel
        modelUrl={currentModels.body.obj}
        mtlUrl={hasRealModel ? null : currentModels.body.mtl}
        textureUrl={null}
        showClothing={showAvatar}
        modelType="body"
      />

      {/* T-Shirt */}
      <AvatarModel
        modelUrl={currentModels.tshirt.obj}
        textureUrl={hasRealModel ? null : currentModels.tshirt.texture}
        showClothing={showClothing}
        modelType="tshirt"
      />

      {/* Pants */}
      <AvatarModel
        modelUrl={currentModels.pants.obj}
        textureUrl={hasRealModel ? null : currentModels.pants.texture}
        showPants={showPants}
        modelType="pants"
      />

      {/* Short Pants */}
      <AvatarModel
        modelUrl={currentModels.shortPants.obj}
        textureUrl={hasRealModel ? null : currentModels.shortPants.texture}
        showShortPants={showShortPants}
        modelType="shortPants"
      />

      {/* Shirt */}
      <AvatarModel
        modelUrl={currentModels.shirt.obj}
        textureUrl={hasRealModel ? null : currentModels.shirt.texture}
        showShirt={showShirt}
        modelType="shirt"
      />

      {/* Skirt - 여성 모델만 */}
      {currentModels.skirt && (
        <AvatarModel
          modelUrl={currentModels.skirt.obj}
          textureUrl={hasRealModel ? null : currentModels.skirt?.texture}
          showSkirt={showSkirt}
          modelType="skirt"
        />
      )}
    </>
  );
};

export default Scene;
