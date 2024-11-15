import React, { createContext, useContext, useState } from 'react';

const ClothingContext = createContext();

export const ClothingProvider = ({ children }) => {
  const [activeClothing, setActiveClothing] = useState({
    showClothing: false,
    showPants: false,
    showShortPants: false,
    showShirt: false,
    showSkirt: false,
    clo_3d: null,
  });

  const [gender, setGender] = useState('female');

  const wearClothing = (type, clo_3d) => {
    if (!type) {
      console.warn('No type provided for clothing');
      return;
    }

    const normalizedType = type.toLowerCase();
    console.log('Wearing clothing:', { normalizedType, clo_3d });

    setActiveClothing((prev) => {
      // 이전 상태를 유지하면서 새로운 의상 추가
      const newState = { ...prev };

      switch (normalizedType) {
        case 't-shirt':
          newState.showClothing = true;
          break;
        case 'pants':
          newState.showPants = true;
          break;
        case 'short-pants':
        case 'short_pants':
          newState.showShortPants = true;
          break;
        case 'shirt':
          newState.showShirt = true;
          break;
        case 'skirt':
          newState.showSkirt = true;
          break;
        default:
          console.warn('Unknown clothing type:', type);
          return prev; // 알 수 없는 타입인 경우 상태 변경하지 않음
      }

      // 각 카테고리별로 3D 모델 정보 저장
      if (clo_3d) {
        newState.clo_3d = {
          ...prev.clo_3d,
          [normalizedType]: clo_3d,
        };
      }

      console.log('New clothing state:', newState);
      return newState;
    });
  };

  // 특정 의상 제거 함수 추가
  const removeClothing = (type) => {
    if (!type) return;

    const normalizedType = type.toLowerCase();

    setActiveClothing((prev) => {
      const newState = { ...prev };

      switch (normalizedType) {
        case 't-shirt':
          newState.showClothing = false;
          break;
        case 'pants':
          newState.showPants = false;
          break;
        case 'short-pants':
        case 'short_pants':
          newState.showShortPants = false;
          break;
        case 'shirt':
          newState.showShirt = false;
          break;
        case 'skirt':
          newState.showSkirt = false;
          break;
      }

      // 해당 타입의 3D 모델 정보 제거
      if (newState.clo_3d) {
        const { [normalizedType]: _, ...rest } = newState.clo_3d;
        newState.clo_3d = rest;
      }

      return newState;
    });
  };

  // 모든 의상 제거 함수 추가
  const removeAllClothing = () => {
    setActiveClothing({
      showClothing: false,
      showPants: false,
      showShortPants: false,
      showShirt: false,
      showSkirt: false,
      clo_3d: null,
    });
  };

  return (
    <ClothingContext.Provider
      value={{
        activeClothing,
        wearClothing,
        removeClothing,
        removeAllClothing,
        gender,
        setGender,
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
