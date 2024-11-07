// Avatar.jsx
import React, { useState } from 'react';
import { Box, Flex, Button, Input, VStack, Text } from '@chakra-ui/react';
import AvatarViewer from '../components/AvatarViewer';
import { useNavigate } from 'react-router-dom';

const Avatar = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleCaptureClick = () => {
    console.log('Capturing...');
  };

  const handleGuideClick = () => {
    console.log('Opening guide...');
  };

  const handleRetakeClick = () => {
    console.log('Retaking...');
  };

  const handleApplyClick = () => {
    console.log('Applying settings:', { gender, height, weight });
  };

  return (
    <Flex
      p={4}
      direction="column"
      align="center"
      width="100%"
      mt={12}
      height="150vh"
    >
      <AvatarViewer
        bodyModelUrl="test_body"
        clothingModelUrl="test_clo"
        onCaptureClick={handleCaptureClick}
        onGuideClick={handleGuideClick}
        onRetakeClick={handleRetakeClick}
      />

      <VStack
        spacing={4}
        width="100%"
        maxWidth={['350px', '600px']}
        p={4}
        boxShadow="md"
        borderRadius="lg"
        bg="white"
        mt={4}
      >
        <Flex justifyContent="space-between" width="100%">
          <Button
            flex="1"
            variant={gender === 'male' ? 'solid' : 'outline'}
            colorScheme={gender === 'male' ? 'blue' : 'gray'}
            onClick={() => setGender('male')}
            mr={2}
          >
            MALE
          </Button>
          <Button
            flex="1"
            variant={gender === 'female' ? 'solid' : 'outline'}
            colorScheme={gender === 'female' ? 'pink' : 'gray'}
            onClick={() => setGender('female')}
            ml={2}
          >
            FEMALE
          </Button>
        </Flex>

        <Box width="100%">
          <Text fontWeight="bold" mb={1}>
            Height
          </Text>
          <Input
            placeholder="Enter your height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            bg="gray.100"
            borderRadius="md"
            mb={2}
          />
          <Text fontWeight="bold" mb={1}>
            Weight
          </Text>
          <Input
            placeholder="Enter your weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            bg="gray.100"
            borderRadius="md"
          />
        </Box>

        <Button colorScheme="teal" size="md" onClick={handleApplyClick}>
          Apply
        </Button>
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => navigate('/measurement-form')}
        >
          Submit
        </Button>
      </VStack>
    </Flex>
  );
};

export default Avatar;
