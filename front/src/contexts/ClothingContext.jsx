import React, { createContext, useContext, useState, useCallback } from 'react';
import { addFitting, removeFitting } from '../services/api';
import { useToast } from '@chakra-ui/react';

const API_URL = process.env.REACT_APP_API_URL || 'https://chack.ngrok.dev';
const ClothingContext = createContext();

export const ClothingProvider = ({ children }) => {
  const [activeClothing, setActiveClothing] = useState({
    avatarIndex: null,
    gender: 'female',
    clo_3d: {
      body: null,
      tshirt: null,
      pant: null,
      shirt: null,
      shortPant: null,
      skirt: null,
    },
    showClothing: true,
    showPant: true,
    showShortPant: false,
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
   */
  const wearClothing = useCallback(
    async (type, clo_idx, clo_mtl_url, clo_name) => {
      console.log('Wearing clothing:', {
        type,
        clo_idx,
        clo_mtl_url,
        clo_name,
      });

      try {
        const response = await addFitting(activeClothing.avatarIndex, clo_idx);
        console.log('Fitting added:', response);

        setFittings((prev) => [...prev, { clo_name, ...response }]); // `clo_name`을 fittings에 추가

        const { avatarIndex, gender } = activeClothing;
        if (avatarIndex === null) {
          throw new Error('avatarIndex가 설정되지 않았습니다.');
        }

        const objUrl = `${API_URL}/files/fittings/garment_${avatarIndex}_${gender}_${type.toLowerCase()}.obj`;

        setActiveClothing((prev) => {
          const newState = { ...prev };

          // 의류 타입에 따른 show 상태 및 clo_3d 업데이트
          switch (type.toLowerCase()) {
            case 't-shirt':
              newState.showClothing = true;
              newState.clo_3d.tshirt = { obj: objUrl, tex: clo_mtl_url };
              break;
            case 'pant':
              newState.showPant = true;
              newState.clo_3d.pant = { obj: objUrl, tex: clo_mtl_url };
              break;
            case 'short-pant':
              newState.showShortPant = true;
              newState.clo_3d.shortPant = { obj: objUrl, tex: clo_mtl_url };
              break;
            case 'shirt':
              newState.showShirt = true;
              newState.clo_3d.shirt = { obj: objUrl, tex: clo_mtl_url };
              break;
            case 'skirt':
              newState.showSkirt = true;
              newState.clo_3d.skirt = { obj: objUrl, tex: clo_mtl_url };
              break;
            default:
              break;
          }

          console.log('Updated activeClothing state:', newState);
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
    [activeClothing.avatarIndex, activeClothing.gender, toast]
  );

  /**
   * 의상을 벗는 함수
   */
  const removeClothingFunc = useCallback(
    async (type, clo_name) => {
      console.log('Removing clothing:', { type, clo_name });

      try {
        if (!type || typeof type !== 'string') {
          throw new Error('유효하지 않은 의류 타입입니다.');
        }

        const fittingToRemove = fittings.find(
          (fitting) => fitting.clo_name === clo_name
        );

        if (!fittingToRemove) {
          throw new Error('해당 의상이 현재 착용 중이지 않습니다.');
        }

        await removeFitting(fittingToRemove.fitting_idx);
        console.log('Fitting removed:', fittingToRemove);

        setFittings((prev) =>
          prev.filter((fitting) => fitting.clo_name !== clo_name)
        );

        setActiveClothing((prev) => {
          const newState = { ...prev };

          switch (type.toLowerCase()) {
            case 't-shirt':
              newState.showClothing = false;
              newState.clo_3d.tshirt = null;
              break;
            case 'pant':
              newState.showPant = false;
              newState.clo_3d.pant = null;
              break;
            case 'short-pant':
              newState.showShortPant = false;
              newState.clo_3d.shortPant = null;
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

          console.log('Updated activeClothing state after removal:', newState);
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
        updateClothing,
        wearClothing,
        removeClothing: removeClothingFunc,
        fittings,
      }}
    >
      {children}
    </ClothingContext.Provider>
  );
};

export const useClothing = () => {
  const context = useContext(ClothingContext);
  if (!context) {
    throw new Error('useClothing must be used within a ClothingProvider');
  }
  return context;
};

export default ClothingContext;
