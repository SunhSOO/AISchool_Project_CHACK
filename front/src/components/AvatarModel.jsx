// src/components/AvatarModel.jsx
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

      console.log('Loading model:', { url, modelType });

      const objLoader = new OBJLoader();
      const mtlLoader = new MTLLoader();
      const textureLoader = new TextureLoader();

      try {
        // MTL 로딩 시도
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
                reject
              );
            });
          } catch (err) {
            console.warn('MTL loading failed:', err);
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
              loadedObj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  if (!child.geometry.attributes.uv) {
                    child.geometry = generateUVs(child.geometry);
                  }

                  if (texUrl) {
                    const texture = textureLoader.load(texUrl);
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.flipY = false;
                    texture.needsUpdate = true;

                    child.material = new THREE.MeshPhysicalMaterial({
                      map: texture,
                      side: THREE.DoubleSide,
                      transparent: true,
                      depthWrite: false,
                      depthTest: true,
                    });
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
              resolve(loadedObj);
            },
            undefined,
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

  if (error) {
    console.error(`Model error (${modelType}):`, error);
    return null;
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
        return true;
    }
  };

  if (!shouldRenderModel()) {
    return null;
  }

  return <group ref={groupRef}>{model && <primitive object={model} />}</group>;
};

export default AvatarModel;
