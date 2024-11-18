import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';
import { extend } from '@react-three/fiber';

extend({ Object3D: THREE.Object3D });

const AvatarModel = ({
  modelUrl,
  textureUrl,
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

  const generateUVs = (geometry) => {
    if (!geometry.attributes.uv) {
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
    }
    return geometry;
  };

  const getMaterial = useCallback((texUrl) => {
    if (materialCache.current[texUrl]) {
      return materialCache.current[texUrl];
    }

    const texture = new TextureLoader().load(
      texUrl,
      undefined,
      undefined,
      (err) => {
        console.error(`Texture loading failed for ${texUrl}:`, err);
        const defaultMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.7,
          metalness: 0.0,
          side: THREE.DoubleSide,
        });
        materialCache.current[texUrl] = defaultMaterial;
      }
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = false;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    materialCache.current[texUrl] = material;
    return material;
  }, []);

  const loadSingleModel = useCallback(
    async (url, texUrl = null) => {
      if (!url) {
        console.warn(`Model URL is null for modelType: ${modelType}`);
        return null;
      }

      console.log('Loading model:', { url, modelType });

      const objLoader = new OBJLoader();

      try {
        const obj = await new Promise((resolve, reject) => {
          objLoader.load(
            url,
            (loadedObj) => {
              loadedObj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.geometry = generateUVs(child.geometry);
                  child.geometry.computeVertexNormals();

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

                  // 렌더링 순서 설정
                  child.renderOrder =
                    modelType === 'body'
                      ? 0
                      : modelType === 'shirt' || modelType === 'upperClothing'
                      ? 1
                      : 2;

                  child.castShadow = true;
                  child.receiveShadow = true;
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
    [modelType, getMaterial]
  );

  useEffect(() => {
    const groupCurrent = groupRef.current;
    let currentModel = null;
    let isMounted = true;

    const loadModel = async () => {
      try {
        const loadedModel = await loadSingleModel(modelUrl, textureUrl);
        if (loadedModel && isMounted) {
          if (modelType === 'body') {
            loadedModel.position.set(0, -0.9, 0);
          }
          loadedModel.scale.set(0.01, 0.01, 0.01);

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
                child.material.forEach((material) => {
                  if (material.map) material.map.dispose();
                  material.dispose();
                });
              } else {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [modelUrl, textureUrl, loadSingleModel, modelType]);

  const shouldRenderModel = () => {
    switch (modelType) {
      case 'body':
        return true;
      case 'tshirt':
        return showClothing;
      case 'pant':
        return showPants;
      case 'shortPant':
        return showShortPants;
      case 'shirt':
        return showShirt;
      case 'skirt':
        return showSkirt;
      default:
        return true;
    }
  };

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

  return (
    <group ref={groupRef}>
      {model && (
        <group>
          {model.children.map((child, index) => {
            if (child instanceof THREE.Mesh) {
              return (
                <mesh
                  key={index}
                  geometry={child.geometry}
                  material={child.material}
                  position={child.position}
                  rotation={child.rotation}
                  scale={child.scale}
                  castShadow
                  receiveShadow
                />
              );
            }
            return null;
          })}
        </group>
      )}
    </group>
  );
};

AvatarModel.propTypes = {
  modelUrl: PropTypes.string.isRequired,
  textureUrl: PropTypes.string,
  showClothing: PropTypes.bool,
  showPants: PropTypes.bool,
  showShortPants: PropTypes.bool,
  showShirt: PropTypes.bool,
  showSkirt: PropTypes.bool,
  modelType: PropTypes.string,
};

export default AvatarModel;
