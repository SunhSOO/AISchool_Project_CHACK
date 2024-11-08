// src/components/Scene.jsx

import React from 'react';
import AvatarModel from './AvatarModel';
import { Environment } from '@react-three/drei';

/**
 * Scene 컴포넌트는 3D 씬을 구성하며 아바타와 티셔츠 모델을 포함합니다.
 *
 * Props:
 * - scale: 아바타와 티셔츠의 기본 스케일
 */
const Scene = ({ scale = 1 }) => {
  return (
    <>
      {/* 기본 조명 설정 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <spotLight
        position={[-5, 5, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={1}
      />

      {/* 환경 설정 */}
      <Environment preset="studio" />

      {/* 아바타 모델 */}
      <AvatarModel
        modelUrl="http://192.168.21.54:8000/models/body_apose.obj"
        textureUrl={null} // 아바타에는 텍스처 사용 안 함
        isShirt={false}
        scale={scale}
        position={[0, 0, 0]} // 화면 중앙에 위치
      />

      {/* 티셔츠 모델 */}
      <AvatarModel
        modelUrl="http://192.168.21.54:8000/models/t-shirt_apose.obj"
        textureUrl="/textures/t-shirt.png
" // 티셔츠 텍스처
        isShirt={true}
        scale={scale}
        position={[0, 0, 0]} // AvatarModel에서 위치 조정
      />

      {/* 바닥 평면 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  );
};

export default Scene;
