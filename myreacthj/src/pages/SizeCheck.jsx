import React from 'react';
import { Box } from '@chakra-ui/react';
import MeasurementForm from '../components/MeasurementForm';

const SizeCheck = () => {
  return (
    <Box pt="60px" pb="60px" maxW="container.md" mx="auto">
      <MeasurementForm></MeasurementForm>
    </Box>
  );
};

export default SizeCheck;
