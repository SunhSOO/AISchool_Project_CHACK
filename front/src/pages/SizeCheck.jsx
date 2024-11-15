// src/pages/SizeCheck.jsx

import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import MeasurementForm from '../components/MeasurementForm';
import AvatarLoading from '../components/AvatarLoading';

const SizeCheck = () => {
  const [isLoading, setIsLoading] = useState(true);

  // 임시 로딩 시뮬레이션
  useEffect(() => {
    // 실제로는 여기서 데이터를 받아옴
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box pt="60px" pb="60px" maxW="container.md" mx="auto">
      {isLoading ? <AvatarLoading /> : <MeasurementForm />}
    </Box>
  );
};

export default SizeCheck;
