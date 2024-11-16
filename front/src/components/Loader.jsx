// src/components/Loader.jsx
import React from 'react';
import { Spinner, Flex } from '@chakra-ui/react';

const Loader = () => (
  <Flex justify="center" align="center" height="100%">
    <Spinner size="xl" color="blue.500" />
  </Flex>
);

export default Loader;
