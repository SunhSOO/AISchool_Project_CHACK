import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';

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

  const loadSingleModel = useCallback(
    async (url, texUrl = null, mtlUrl = null) => {
      if (!url) return null;

      const objLoader = new OBJLoader();
      const mtlLoader = new MTLLoader();
      const textureLoader = new TextureLoader();

      try {
        // MTL 로딩 시도
        let materials = null;
        if (mtlUrl) {
          try {
            console.log('Attempting to load MTL:', mtlUrl);
            materials = await new Promise((resolve, reject) => {
              mtlLoader.load(
                mtlUrl,
                (loadedMaterials) => {
                  console.log('MTL loaded successfully');
                  loadedMaterials.preload();
                  resolve(loadedMaterials);
                },
                (xhr) => {
                  console.log(
                    'MTL loading progress:',
                    (xhr.loaded / xhr.total) * 100 + '%'
                  );
                },
                (error) => {
                  console.warn(
                    'MTL load failed, continuing without materials:',
                    error
                  );
                  resolve(null);
                }
              );
            });
          } catch (err) {
            console.warn(
              'MTL loading error, continuing without materials:',
              err
            );
            materials = null;
          }
        }

        if (materials) {
          objLoader.setMaterials(materials);
        }

        const obj = await new Promise((resolve, reject) => {
          objLoader.load(
            url,
            (loadedObj) => {
              console.log('Loaded model:', {
                url: url,
                type: modelType,
                hasMaterials: materials ? 'yes' : 'no',
              });

              loadedObj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  if (!child.geometry.attributes.uv) {
                    console.log('Generating UVs for:', modelType);
                    child.geometry = generateUVs(child.geometry);
                  }

                  if (texUrl) {
                    const texture = textureLoader.load(
                      texUrl,
                      (loadedTexture) => {
                        console.log('Texture loaded for:', modelType);
                        loadedTexture.colorSpace = THREE.SRGBColorSpace;
                        loadedTexture.minFilter = THREE.LinearFilter;
                        loadedTexture.magFilter = THREE.LinearFilter;
                        loadedTexture.flipY = false;
                        loadedTexture.needsUpdate = true;
                      },
                      undefined,
                      (error) => {
                        console.error(
                          'Texture load error for:',
                          modelType,
                          error
                        );
                      }
                    );

                    child.material = new THREE.MeshPhysicalMaterial({
                      map: texture,
                      side: THREE.DoubleSide,
                      roughness: 1,
                      metalness: 0.0,
                      envMapIntensity: 1.0,
                      clearcoat: 0.0,
                      clearcoatRoughness: 0.0,
                      transmission: 0.0,
                      thickness: 0.0,
                      transparent: true,
                      opacity: 1.0,
                      depthWrite: false, // 추가: 투명도 설정 시 depthWrite 비활성화
                      depthTest: true, // depthTest 활성화
                    });
                  } else {
                    child.material = new THREE.MeshStandardMaterial({
                      color: 0xcccccc,
                      roughness: 0.7,
                      metalness: 0.0,
                      side: THREE.DoubleSide,
                      depthWrite: true,
                      depthTest: true,
                    });
                  }

                  // renderOrder 설정: 상의는 먼저 렌더링
                  if (modelType === 'shirt' || modelType === 'upperClothing') {
                    child.renderOrder = 1; // 상의는 먼저 렌더링
                  } else {
                    child.renderOrder = 2; // 기타는 나중에 렌더링
                  }
                }
              });
              resolve(loadedObj);
            },
            (xhr) => {
              console.log(
                `Loading ${modelType}:`,
                (xhr.loaded / xhr.total) * 100 + '%'
              );
            },
            reject
          );
        });

        return obj;
      } catch (err) {
        console.error(`Error loading ${modelType}:`, err);
        return null;
      }
    },
    [modelType]
  );

  useEffect(() => {
    const groupCurrent = groupRef.current;
    let currentModel = null;

    const loadModel = async () => {
      try {
        console.log(`Loading ${modelType} model:`, {
          modelUrl,
          textureUrl,
          mtlUrl,
          showClothing,
        });

        const loadedModel = await loadSingleModel(modelUrl, textureUrl, mtlUrl);
        if (loadedModel) {
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          currentModel = loadedModel;
          setModel(loadedModel);
          setError(null);
        }
      } catch (err) {
        console.error(`Error loading ${modelType}:`, err);
        setError('모델 로딩 실패');
      }
    };

    loadModel();

    return () => {
      if (groupCurrent && currentModel) {
        console.log(`Cleaning up ${modelType} model`);
        groupCurrent.remove(currentModel);
        // 메모리 누수를 방지하기 위해 모델을 dispose 합니다.
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
  }, [modelUrl, textureUrl, mtlUrl, loadSingleModel, modelType, showClothing]);

  if (error) {
    console.error(`Model error (${modelType}):`, error);
    return (
      <group ref={groupRef}>
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    );
  }

  const shouldRenderModel = () => {
    switch (modelType) {
      case 'body':
        return showClothing;
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
        return false;
    }
  };

  const isVisible = shouldRenderModel();

  console.log(`Model visibility check (${modelType}):`, {
    showClothing,
    showPants,
    showShortPants,
    showShirt,
    showSkirt,
    isVisible,
    modelUrl,
  });

  if (!isVisible) {
    return null;
  }

  return <group ref={groupRef}>{model && <primitive object={model} />}</group>;
};

export default AvatarModel;
