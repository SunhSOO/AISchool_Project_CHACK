// src/components/Loader.jsx
import React from 'react';
import { Html, useProgress } from '@react-three/drei';
import { VStack, Text, Progress } from '@chakra-ui/react';

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <VStack spacing={4} alignItems="center">
        <Text color="white" fontSize="lg">
          Loading... {progress.toFixed(0)}%
        </Text>
        <Progress
          value={progress}
          size="sm"
          width="200px"
          colorScheme="teal"
          isAnimated
        />
      </VStack>
    </Html>
  );
};

export default Loader;
