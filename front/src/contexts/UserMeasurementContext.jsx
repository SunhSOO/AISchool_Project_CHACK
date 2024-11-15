// src/contexts/UserMeasurementContext.jsx
import React, { createContext, useContext, useState } from 'react';

const UserMeasurementContext = createContext();

export const UserMeasurementProvider = ({ children }) => {
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    avatarIndex: 28,
    gender: 'female',
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
