// src/contexts/ClothingContext.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { addFitting, removeFitting } from '../services/api';
import { useToast } from '@chakra-ui/react';

const ClothingContext = createContext();

export const ClothingProvider = ({ children }) => {
  const [activeClothing, setActiveClothing] = useState({
    avatarIndex: null,
    gender: 'female',
    clo_3d: {
      body: null,
      tshirt: null,
      pants: null,
      shirt: null,
      shortPants: null,
      skirt: null,
    },
    showClothing: true,
    showPants: false,
    showShortPants: false,
    showShirt: false,
    showSkirt: false,
  });

  const [fittings, setFittings] = useState([]); // 현재 입은 의류의 fitting 정보를 저장
  const toast = useToast();

  /**
   * 의류 상태 업데이트 함수 메모이제이션
   */
  const updateClothing = useCallback((newClothing) => {
    console.log('Clothing to update:', newClothing); // 로그 추가

    setActiveClothing((prev) => ({
      ...prev,
      ...newClothing,
    }));
  }, []);

  /**
   * 의상을 착용하는 함수
   * @param {string} type - 의류 타입 (예: 'tshirt')
   * @param {number} clo_idx - 의류 식별자
   * @param {string} clo_mtl_url - 의류 텍스처 URL
   * @param {string} clo_name - 의류 이름
   */
  const wearClothing = useCallback(
    async (type, clo_idx, clo_mtl_url, clo_name) => {
      console.log('Wearing clothing:', {
        type,
        clo_idx,
        clo_mtl_url,
        clo_name,
      }); // 로그 추가

      try {
        const response = await addFitting(activeClothing.avatarIndex, clo_idx);
        console.log('Fitting added:', response); // 로그 추가

        setFittings((prev) => [...prev, response]); // 새로운 fitting 추가

        // 의류 타입별 OBJ 파일 경로 설정
        const objPathMap = {
          't-shirt': '/models/tshirt.obj',
          pants: '/models/pants.obj',
          'short-pants': '/models/short-pants.obj',
          shirt: '/models/shirt.obj',
          skirt: '/models/skirt.obj',
        };

        const objUrl = objPathMap[type.toLowerCase()];

        if (!objUrl) {
          throw new Error(`지원하지 않는 의류 타입입니다: ${type}`);
        }

        setActiveClothing((prev) => {
          const newState = { ...prev };

          // 의류 타입에 따른 show 상태 및 clo_3d 업데이트
          switch (type.toLowerCase()) {
            case 't-shirt':
              newState.showClothing = true;
              newState.clo_3d.tshirt = {
                obj: objUrl,
                tex: clo_mtl_url,
              };
              break;
            case 'pants':
              newState.showPants = true;
              newState.clo_3d.pants = {
                obj: objUrl,
                tex: clo_mtl_url,
              };
              break;
            case 'short-pants':
              newState.showShortPants = true;
              newState.clo_3d.shortPants = {
                obj: objUrl,
                tex: clo_mtl_url,
              };
              break;
            case 'shirt':
              newState.showShirt = true;
              newState.clo_3d.shirt = {
                obj: objUrl,
                tex: clo_mtl_url,
              };
              break;
            case 'skirt':
              newState.showSkirt = true;
              newState.clo_3d.skirt = {
                obj: objUrl,
                tex: clo_mtl_url,
              };
              break;
            default:
              break;
          }

          console.log('Updated activeClothing state:', newState); // 로그 추가
          return newState;
        });

        toast({
          title: '의상 착용 성공',
          description: `${clo_name}이(가) 성공적으로 착용되었습니다.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('의상 착용 실패:', error);
        toast({
          title: '의상 착용 실패',
          description: error.message || '의상을 착용하는 데 실패했습니다.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [activeClothing.avatarIndex, toast]
  );

  /**
   * 의상을 벗는 함수
   * @param {string} type - 의류 타입 (예: 'tshirt')
   * @param {string} clo_name - 의류 이름
   */
  const removeClothingFunc = useCallback(
    async (type, clo_name) => {
      console.log('Removing clothing:', { type, clo_name }); // 로그 추가

      try {
        // 해당 타입의 fitting 찾기
        const fittingToRemove = fittings.find((fitting) => {
          return fitting.clo_desc.toLowerCase() === type.toLowerCase();
        });

        console.log('Fitting to remove:', fittingToRemove); // 로그 추가

        if (!fittingToRemove) {
          throw new Error('해당 의상이 현재 착용 중이지 않습니다.');
        }

        await removeFitting(fittingToRemove.fitting_idx);
        console.log('Fitting removed:', fittingToRemove); // 로그 추가

        setFittings((prev) =>
          prev.filter(
            (fitting) => fitting.fitting_idx !== fittingToRemove.fitting_idx
          )
        );

        setActiveClothing((prev) => {
          const newState = { ...prev };

          // 의류 타입에 따른 show 상태 및 clo_3d 업데이트
          switch (type.toLowerCase()) {
            case 't-shirt':
              newState.showClothing = false;
              newState.clo_3d.tshirt = null;
              break;
            case 'pant':
              newState.showPants = false;
              newState.clo_3d.pants = null;
              break;
            case 'short-pant':
              newState.showShortPants = false;
              newState.clo_3d.shortPants = null;
              break;
            case 'shirt':
              newState.showShirt = false;
              newState.clo_3d.shirt = null;
              break;
            case 'skirt':
              newState.showSkirt = false;
              newState.clo_3d.skirt = null;
              break;
            default:
              break;
          }

          console.log('Updated activeClothing state after removal:', newState); // 로그 추가
          return newState;
        });

        toast({
          title: '의상 제거 성공',
          description: `${clo_name}을(를) 성공적으로 제거했습니다.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('의상 제거 실패:', error);
        toast({
          title: '의상 제거 실패',
          description: error.message || '의상을 제거하는 데 실패했습니다.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [fittings, toast]
  );

  return (
    <ClothingContext.Provider
      value={{
        activeClothing,
        updateClothing: updateClothing,
        wearClothing,
        removeClothing: removeClothingFunc,
        fittings,
      }}
    >
      {children}
    </ClothingContext.Provider>
  );
};

// useClothing 훅 정의
export const useClothing = () => {
  const context = useContext(ClothingContext);
  if (!context) {
    throw new Error('useClothing must be used within a ClothingProvider');
  }
  return context;
};

export default ClothingContext;
