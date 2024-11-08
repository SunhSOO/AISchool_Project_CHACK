import React, { useState } from 'react';
import { Box, Flex, Button, VStack } from '@chakra-ui/react';
import AvatarViewer from '../components/AvatarViewer';
import { useNavigate } from 'react-router-dom';

const Avatar = () => {
  const navigate = useNavigate();
  const [showAvatar, setShowAvatar] = useState(true);
  const [showTshirt, setShowTshirt] = useState(false);
  const [showPants, setShowPants] = useState(false);
  const [showShortPants, setShowShortPants] = useState(false);
  const [showShirt, setShowShirt] = useState(false);
  const [showSkirt, setShowSkirt] = useState(false);

  const handleItemClick = (itemType) => {
    console.log('Clicking:', itemType);
    switch (itemType) {
      case 'avatar':
        setShowAvatar(!showAvatar);
        break;
      case 'tshirt':
        setShowTshirt(!showTshirt);
        // 다른 상의 끄기
        setShowShirt(false);
        break;
      case 'pants':
        setShowPants(!showPants);
        // 다른 하의 끄기
        setShowShortPants(false);
        setShowSkirt(false);
        break;
      case 'shortPants':
        setShowShortPants(!showShortPants);
        // 다른 하의 끄기
        setShowPants(false);
        setShowSkirt(false);
        break;
      case 'shirt':
        setShowShirt(!showShirt);
        // 다른 상의 끄기
        setShowTshirt(false);
        break;
      case 'skirt':
        setShowSkirt(!showSkirt);
        // 다른 하의 끄기
        setShowPants(false);
        setShowShortPants(false);
        break;
      default:
        break;
    }
  };

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
    console.log('Applying settings...');
  };

  return (
    <Flex
      p={4}
      direction="column"
      align="center"
      width="100%"
      mt={12}
      height="100vh"
    >
      <AvatarViewer
        showAvatar={showAvatar}
        showClothing={showTshirt}
        showPants={showPants}
        showShortPants={showShortPants}
        showShirt={showShirt}
        showSkirt={showSkirt}
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
        <Box width="100%">
          <Button
            width="100%"
            colorScheme="red"
            size="lg"
            onClick={() => handleItemClick('avatar')}
            variant={showAvatar ? 'solid' : 'outline'}
            mb={4}
          >
            Avatar
          </Button>

          {/* 상의 컨트롤 */}
          <Flex justifyContent="space-between" gap={4} mb={4}>
            <Button
              flex="1"
              colorScheme="red"
              size="lg"
              onClick={() => handleItemClick('tshirt')}
              variant={showTshirt ? 'solid' : 'outline'}
            >
              T-Shirt
            </Button>
            <Button
              flex="1"
              colorScheme="red"
              size="lg"
              onClick={() => handleItemClick('shirt')}
              variant={showShirt ? 'solid' : 'outline'}
            >
              Shirt
            </Button>
          </Flex>

          {/* 하의 컨트롤 */}
          <Flex justifyContent="space-between" gap={4} mb={4}>
            <Button
              flex="1"
              colorScheme="red"
              size="lg"
              onClick={() => handleItemClick('pants')}
              variant={showPants ? 'solid' : 'outline'}
            >
              Pants
            </Button>
            <Button
              flex="1"
              colorScheme="red"
              size="lg"
              onClick={() => handleItemClick('shortPants')}
              variant={showShortPants ? 'solid' : 'outline'}
            >
              Short Pants
            </Button>
            <Button
              flex="1"
              colorScheme="red"
              size="lg"
              onClick={() => handleItemClick('skirt')}
              variant={showSkirt ? 'solid' : 'outline'}
            >
              Skirt
            </Button>
          </Flex>
        </Box>

        <Button
          colorScheme="red"
          size="lg"
          width="100%"
          onClick={handleApplyClick}
        >
          Apply
        </Button>

        <Button
          colorScheme="red"
          size="lg"
          width="100%"
          onClick={() => navigate('/measurement-form')}
        >
          Submit
        </Button>
      </VStack>
    </Flex>
  );
};

export default Avatar;
