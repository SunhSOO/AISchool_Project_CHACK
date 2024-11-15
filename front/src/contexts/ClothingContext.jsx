// src/contexts/ClothingContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ClothingContext = createContext();

export const ClothingProvider = ({ children }) => {
  const [activeClothing, setActiveClothing] = useState({
    showClothing: true,
    showPants: true,
    showShortPants: false,
    showShirt: true,
    showSkirt: false,
    gender: 'female',
    avatarIndex: 28,
    clo_3d: null,
  });

  const updateClothing = (newData) => {
    setActiveClothing((prev) => ({ ...prev, ...newData }));
  };

  return (
    <ClothingContext.Provider value={{ activeClothing, updateClothing }}>
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
