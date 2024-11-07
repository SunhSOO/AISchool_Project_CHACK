// src/components/Scene.jsx
import React from 'react';
import AvatarModel from './AvatarModel';
import { Environment } from '@react-three/drei'; // Environment import 추가

/**
 * Scene 컴포넌트는 3D 씬을 구성하며 아바타와 티셔츠 모델을 포함합니다.
 *
 * Props:
 * - scale: 아바타와 티셔츠의 기본 스케일
 */
const Scene = ({ scale = 1 }) => {
  return (
    <>
      {/* 조명 설정 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <spotLight
        position={[-5, 5, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={1}
      />
      <Environment preset="studio" /> {/* 환경 설정 */}
      {/* 아바타 모델 */}
      <AvatarModel
        modelUrl="http://192.168.20.96:8000/models/body_apose.obj"
        materialUrl="http://192.168.20.96:8000/models/body_A_pose.mtl"
        scale={scale} // 아바타와 티셔츠 모두 동일한 스케일 적용
        isShirt={false} // 아바타임을 명시
        position={[0, 0, 0]} // 위치 조정
      />
      {/* 티셔츠 모델 */}
      <AvatarModel
        modelUrl="http://192.168.20.96:8000/models/t-shirt_apose.obj"
        textureUrl="http://192.168.20.96:8000/models/t-shirt.png"
        useTexture={true}
        scale={scale} // 아바타와 티셔츠 모두 동일한 스케일 적용
        isShirt={true} // 티셔츠임을 명시
        position={[0, 0, 0]} // 위치 조정
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
