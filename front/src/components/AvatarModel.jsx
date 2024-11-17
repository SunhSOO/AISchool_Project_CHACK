// src/components/AvatarModel.jsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';

const AvatarModel = ({
  modelUrl,
  textureUrl,
  mtlUrl,
  showClothing = false,
  showPants = false,
  showShortPants = false,
  showShirt = false,
  showSkirt = false,
  modelType = 'body',
}) => {
  const groupRef = useRef();
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const materialCache = useRef({});

  /**
   * UV 좌표 생성 함수
   * 만약 geometry에 UV 좌표가 없다면 자동으로 생성
   * @param {THREE.BufferGeometry} geometry
   * @returns {THREE.BufferGeometry}
   */
  const generateUVs = (geometry) => {
    const positions = geometry.attributes.position;
    const uvs = [];
    const bbox = new THREE.Box3();
    bbox.setFromBufferAttribute(positions);

    const size = new THREE.Vector3();
    bbox.getSize(size);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      const u = (x - bbox.min.x) / size.x;
      const v = (y - bbox.min.y) / size.y;

      uvs.push(u, v);
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    return geometry;
  };

  /**
   * 텍스처 로딩 및 재질 생성 함수
   * @param {string} texUrl - 텍스처 URL
   * @returns {THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial}
   */
  const getMaterial = (texUrl) => {
    if (materialCache.current[texUrl]) {
      return materialCache.current[texUrl];
    }

    const texture = new TextureLoader().load(
      texUrl,
      undefined,
      undefined,
      (err) => {
        console.error(`Texture loading failed for ${texUrl}:`, err);
        // 폴백 텍스처 로드
        const fallbackTexture = new TextureLoader().load(
          '/textures/default.png',
          undefined,
          undefined,
          (fallbackErr) => {
            console.error('Fallback texture loading failed:', fallbackErr);
          }
        );
        fallbackTexture.colorSpace = THREE.SRGBColorSpace;
        fallbackTexture.minFilter = THREE.LinearFilter;
        fallbackTexture.magFilter = THREE.LinearFilter;
        fallbackTexture.flipY = false;

        const fallbackMaterial = new THREE.MeshPhysicalMaterial({
          map: fallbackTexture,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          depthTest: true,
        });

        materialCache.current[texUrl] = fallbackMaterial;
      }
    );

    // sRGBColorSpace 및 필터 설정
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = false;

    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    materialCache.current[texUrl] = material;
    return material;
  };

  /**
   * 단일 모델 로드 함수
   * @param {string} url - OBJ 파일 URL
   * @param {string|null} texUrl - 텍스처 URL
   * @param {string|null} mtlUrl - MTL 파일 URL
   * @returns {Promise<THREE.Object3D | null>}
   */
  const loadSingleModel = useCallback(
    async (url, texUrl = null, mtlUrl = null) => {
      if (!url) {
        console.warn(`Model URL is null for modelType: ${modelType}`);
        return null;
      }

      console.log('Loading model:', { url, modelType });

      const objLoader = new OBJLoader();
      const mtlLoader = new MTLLoader();

      try {
        let materials = null;
        if (mtlUrl) {
          try {
            materials = await new Promise((resolve, reject) => {
              mtlLoader.load(
                mtlUrl,
                (loadedMaterials) => {
                  loadedMaterials.preload();
                  resolve(loadedMaterials);
                },
                undefined,
                (error) => {
                  console.error(
                    `Failed to load MTL file from ${mtlUrl}:`,
                    error
                  );
                  resolve(null); // Continue without materials
                }
              );
            });
            if (materials) {
              objLoader.setMaterials(materials);
              console.log(`Successfully loaded MTL for ${modelType}`);
            }
          } catch (err) {
            console.warn('MTL loading failed:', err);
            materials = null;
          }
        }

        const obj = await new Promise((resolve, reject) => {
          objLoader.load(
            url,
            (loadedObj) => {
              loadedObj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  if (!child.geometry.attributes.uv) {
                    child.geometry = generateUVs(child.geometry);
                  }

                  if (texUrl) {
                    child.material = getMaterial(texUrl);
                  } else {
                    child.material = new THREE.MeshStandardMaterial({
                      color: 0xcccccc,
                      roughness: 0.7,
                      metalness: 0.0,
                      side: THREE.DoubleSide,
                    });
                  }

                  if (modelType === 'shirt' || modelType === 'upperClothing') {
                    child.renderOrder = 1;
                  } else {
                    child.renderOrder = 2;
                  }
                }
              });
              console.log(`Successfully loaded OBJ for ${modelType}`);
              resolve(loadedObj);
            },
            undefined,
            (error) => {
              console.error(`Failed to load OBJ file from ${url}:`, error);
              reject(error);
            }
          );
        });

        return obj;
      } catch (err) {
        console.error(`Error loading ${modelType} from ${url}:`, err);
        setError('모델 로딩에 실패했습니다.');
        return null;
      }
    },
    [modelType]
  );

  useEffect(() => {
    const groupCurrent = groupRef.current;
    let currentModel = null;
    let isMounted = true;

    const loadModel = async () => {
      try {
        const loadedModel = await loadSingleModel(modelUrl, textureUrl, mtlUrl);
        if (loadedModel && isMounted) {
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          currentModel = loadedModel;
          setModel(loadedModel);
          setError(null);
          console.log(`Successfully loaded ${modelType} model.`);
        }
      } catch (err) {
        console.error(
          `Error loading model in useEffect for ${modelType}:`,
          err
        );
        if (isMounted) setError('모델 로딩에 실패했습니다.');
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      if (groupCurrent && currentModel) {
        groupCurrent.remove(currentModel);
        currentModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [modelUrl, textureUrl, mtlUrl, loadSingleModel, modelType]);

  /**
   * 모델 렌더링 여부 결정 함수
   * @returns {boolean}
   */
  const shouldRenderModel = () => {
    switch (modelType) {
      case 'body':
        return true;
      case 'tshirt':
        return showClothing;
      case 'pants':
        return showPants;
      case 'shortPants':
        return showShortPants;
      case 'shirt':
        return showShirt;
      case 'skirt':
        return showSkirt;
      default:
        return true;
    }
  };

  // 전달된 props 확인을 위한 로그
  useEffect(() => {
    console.log(
      `AvatarModel Props - modelType: ${modelType}, showClothing: ${showClothing}, showPants: ${showPants}, showShortPants: ${showShortPants}, showShirt: ${showShirt}, showSkirt: ${showSkirt}`
    );
  }, [
    modelType,
    showClothing,
    showPants,
    showShortPants,
    showShirt,
    showSkirt,
  ]);

  if (error) {
    return (
      <Box>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!shouldRenderModel()) {
    console.log(`Not rendering ${modelType} model based on show flags.`);
    return null;
  }

  return <group ref={groupRef}>{model && <primitive object={model} />}</group>;
};

AvatarModel.propTypes = {
  modelUrl: PropTypes.string.isRequired,
  textureUrl: PropTypes.string,
  mtlUrl: PropTypes.string,
  showClothing: PropTypes.bool,
  showPants: PropTypes.bool,
  showShortPants: PropTypes.bool,
  showShirt: PropTypes.bool,
  showSkirt: PropTypes.bool,
  modelType: PropTypes.string,
};

export default AvatarModel;
