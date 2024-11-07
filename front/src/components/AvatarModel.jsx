// src/components/AvatarModel.js
import React, { useEffect, useRef, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';

/**
 * AvatarModel 컴포넌트는 아바타 또는 티셔츠 모델을 로드하고 크기와 위치를 조정합니다.
 *
 * Props:
 * - modelUrl: 모델의 OBJ 파일 URL
 * - materialUrl: 모델의 MTL 파일 URL
 * - textureUrl: 모델에 입힐 텍스처 이미지 URL
 * - useTexture: 텍스처를 사용할지 여부 (기본값: false)
 * - isShirt: 이 모델이 티셔츠인지 여부 (기본값: false)
 * - scale: 기본 스케일 (기본값: 1)
 * - position: 모델의 위치 (기본값: [0, 0, 0])
 */
const AvatarModel = ({
  modelUrl,
  materialUrl,
  textureUrl,
  useTexture = false,
  isShirt = false,
  scale = 1,
  position = [0, 0, 0],
}) => {
  const group = useRef(); // 그룹 참조
  const [model, setModel] = useState(null); // 모델 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    const loadModel = async () => {
      try {
        const objLoader = new OBJLoader();

        if (useTexture && textureUrl) {
          // 텍스처를 사용하는 경우
          const textureLoader = new TextureLoader();
          const texture = textureLoader.load(textureUrl);

          objLoader.load(
            modelUrl,
            (obj) => {
              obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  // 텍스처를 적용한 재질 설정
                  child.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.8,
                    metalness: 0.1,
                  });
                }
              });

              // 모델의 크기와 위치 조정
              adjustModelScaleAndPosition(obj, scale, isShirt);
              setModel(obj);
              setError(null);
            },
            (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
            (err) => {
              console.error('Error loading model with texture:', err);
              setError(err.message);
            }
          );
        } else if (materialUrl) {
          // MTL 파일을 사용하는 경우
          const mtlLoader = new MTLLoader();
          mtlLoader.load(materialUrl, (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);

            objLoader.load(
              modelUrl,
              (obj) => {
                obj.traverse((child) => {
                  if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                  }
                });

                // 모델의 크기와 위치 조정
                adjustModelScaleAndPosition(obj, scale, isShirt);
                setModel(obj);
                setError(null);
              },
              (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
              (error) => {
                console.error('Error loading model with MTL:', error);
                setError(error.message);
              }
            );
          });
        } else {
          throw new Error('Material or texture URL not provided');
        }
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err.message);
      }
    };

    loadModel();
  }, [modelUrl, materialUrl, textureUrl, useTexture, isShirt, scale]);

  /**
   * 모델의 크기와 위치를 조정하는 함수
   * @param {THREE.Object3D} obj - 조정할 모델 객체
   * @param {number} scale - 기본 스케일
   * @param {boolean} isShirt - 티셔츠 여부
   */
  const adjustModelScaleAndPosition = (obj, scale, isShirt) => {
    // 모델의 바운딩 박스를 계산
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size); // 모델 크기
    const center = new THREE.Vector3();
    box.getCenter(center); // 모델의 중심

    // 최대 차원 계산
    const maxDim = Math.max(size.x, size.y, size.z);

    // 기본 스케일 설정
    let baseScale = isShirt ? 1.5 : 1.7; // 티셔츠와 아바타의 기본 스케일

    // 최종 스케일 계산
    const finalScale = (baseScale / maxDim) * scale;

    // 모델 스케일 적용
    obj.scale.setScalar(finalScale);

    // 모델의 중심을 기준으로 위치 조정
    obj.position.sub(center.multiplyScalar(finalScale));
    obj.position.y = isShirt ? -0.5 : 0; // 티셔츠는 약간 아래로 위치 조정
  };

  // 모델 로드 중 오류가 발생하거나 모델이 아직 로드되지 않은 경우 렌더링하지 않음
  if (!model || error) {
    return null;
  }

  return (
    <group ref={group} position={position}>
      <primitive object={model} position={[0, 0, 0]} rotation={[0, 0, 0]} />
    </group>
  );
};

export default AvatarModel;
