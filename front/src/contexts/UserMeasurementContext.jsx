import React, { createContext, useContext, useState } from 'react';

const UserMeasurementContext = createContext();

export const UserMeasurementProvider = ({ children }) => {
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    avatarIndex: null,
    gender: 'F', // 기본값을 'F'로 설정
    chestCircumference: '',
    waistCircumference: '',
    hipCircumference: '',
    isAvatarGenerated: false,
    recommendedSize: null,
  });

  const updateMeasurements = (newData) => {
    setMeasurements((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserMeasurementContext.Provider
      value={{ measurements, updateMeasurements }}
    >
      {children}
    </UserMeasurementContext.Provider>
  );
};

export const useMeasurements = () => {
  const context = useContext(UserMeasurementContext);
  if (!context) {
    throw new Error(
      'useMeasurements must be used within a UserMeasurementProvider'
    );
  }
  return context;
};
