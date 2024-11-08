import React, { useEffect, useRef, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const AvatarModel = ({ modelUrl, textureUrl, isShirt = false }) => {
  const groupRef = useRef();
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const objLoader = new OBJLoader();
    const textureLoader = new TextureLoader();
    let currentModel = null;
    const groupCurrent = groupRef.current;

    const loadModel = async () => {
      try {
        const obj = await new Promise((resolve, reject) => {
          objLoader.load(
            modelUrl,
            (loadedObj) => {
              console.log('Loaded model data:', {
                position: loadedObj.position,
                rotation: loadedObj.rotation,
                scale: loadedObj.scale,
              });

              // 메시 정보 출력
              loadedObj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  console.log('Mesh data:', {
                    position: child.position,
                    vertices: child.geometry.attributes.position,
                    verticesArray: Array.from(
                      child.geometry.attributes.position.array
                    ),
                    normal: child.geometry.attributes.normal,
                    normalArray: Array.from(
                      child.geometry.attributes.normal.array
                    ),
                  });
                }
              });

              resolve(loadedObj);
            },
            (xhr) => {
              console.log(
                `Loading model: ${(xhr.loaded / xhr.total) * 100}% loaded`
              );
            },
            (err) => {
              console.error(`Error loading OBJ model from ${modelUrl}:`, err);
              reject(err);
            }
          );
        });

        if (isShirt && textureUrl) {
          const texture = await new Promise((resolve, reject) => {
            textureLoader.load(
              textureUrl,
              (loadedTexture) => {
                console.log(`Successfully loaded texture from ${textureUrl}`);
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                loadedTexture.needsUpdate = true;
                resolve(loadedTexture);
              },
              undefined,
              (err) => {
                console.error(`Error loading texture from ${textureUrl}:`, err);
                reject(err);
              }
            );
          });

          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const material = new THREE.MeshStandardMaterial({
                map: texture,
                side: THREE.DoubleSide,
              });
              child.material = material;
            }
          });
        } else {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: isShirt ? 0xaaaaaa : 0xcccccc,
                side: THREE.DoubleSide,
              });
            }
          });
        }

        currentModel = obj;
        setModel(obj);
        setError(null);
      } catch (err) {
        console.error('Error in loadModel:', err);
        setError('모델 로딩 실패');
      }
    };

    loadModel();

    return () => {
      if (groupCurrent && currentModel) {
        groupCurrent.remove(currentModel);
      }
    };
  }, [modelUrl, textureUrl, isShirt]);

  if (error) {
    return (
      <group ref={groupRef}>
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    );
  }

  return <group ref={groupRef}>{model && <primitive object={model} />}</group>;
};

export default AvatarModel;
