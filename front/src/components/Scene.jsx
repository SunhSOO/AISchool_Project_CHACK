import React from 'react';
import AvatarModel from './AvatarModel';
import { Environment } from '@react-three/drei';

const Scene = ({
  showAvatar,
  showClothing,
  showPants,
  showShortPants,
  showShirt,
  showSkirt,
}) => {
  const MODEL_URL = `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_MODEL_PATH}`;

  const MODEL_FILES = {
    body: {
      obj: 'body_apose.obj',
      mtl: 'body_A_pose.mtl',
    },
    tshirt: {
      obj: 't-shirt_apose.obj',
    },
    pants: {
      obj: 'pant_apose.obj',
    },
    shortPants: {
      obj: 'short-pant_apose.obj',
    },
    shirt: {
      obj: 'shirt_apose.obj',
    },
    skirt: {
      obj: 'skirt_apose.obj',
    },
  };

  console.log('Scene loading models:', {
    modelPaths: {
      bodyObj: `${MODEL_URL}/${MODEL_FILES.body.obj}`,
      bodyMtl: `${MODEL_URL}/${MODEL_FILES.body.mtl}`,
      tshirt: `${MODEL_URL}/${MODEL_FILES.tshirt.obj}`,
      pants: `${MODEL_URL}/${MODEL_FILES.pants.obj}`,
      shortPants: `${MODEL_URL}/${MODEL_FILES.shortPants.obj}`,
      shirt: `${MODEL_URL}/${MODEL_FILES.shirt.obj}`,
      skirt: `${MODEL_URL}/${MODEL_FILES.skirt.obj}`,
    },
    visibility: {
      showAvatar,
      showClothing,
      showPants,
      showShortPants,
      showShirt,
      showSkirt,
    },
  });

  return (
    <>
      {/* 그림자 제거를 위해 모든 라이트에서 그림자 속성 제거 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <spotLight
        position={[-5, 5, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={1}
      />
      <Environment preset="studio" />
      {/* Avatar Model */}
      <AvatarModel
        modelUrl={`${MODEL_URL}/${MODEL_FILES.body.obj}`}
        mtlUrl={`${MODEL_URL}/${MODEL_FILES.body.mtl}`}
        textureUrl={null}
        showClothing={showAvatar}
        modelType="body"
      />
      {/* T-Shirt Model */}
      <AvatarModel
        modelUrl={`${MODEL_URL}/${MODEL_FILES.tshirt.obj}`}
        textureUrl="/textures/t-shirt.png"
        showClothing={showClothing}
        modelType="tshirt"
      />
      {/* Pants Model */}
      <AvatarModel
        modelUrl={`${MODEL_URL}/${MODEL_FILES.pants.obj}`}
        textureUrl="/textures/pants.png"
        showPants={showPants}
        modelType="pants"
      />
      {/* Short Pants Model */}
      <AvatarModel
        modelUrl={`${MODEL_URL}/${MODEL_FILES.shortPants.obj}`}
        textureUrl="/textures/short-pants.png"
        showShortPants={showShortPants}
        modelType="shortPants"
      />
      {/* Shirt Model */}
      <AvatarModel
        modelUrl={`${MODEL_URL}/${MODEL_FILES.shirt.obj}`}
        textureUrl="/textures/shirt.png"
        showShirt={showShirt}
        modelType="shirt"
      />
      {/* Skirt Model */}
      <AvatarModel
        modelUrl={`${MODEL_URL}/${MODEL_FILES.skirt.obj}`}
        textureUrl="/textures/skirt.png"
        showSkirt={showSkirt}
        modelType="skirt"
      />
      {/* 평면 메쉬 수정: 그림자를 받지 않도록 설정
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh> */}
    </>
  );
};

export default Scene;
