import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Checkbox,
  VStack,
  Button,
  Flex,
  Divider,
  IconButton,
  Container,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const AgreementPage = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState({
    termsOfService: false,
    privacyPolicy: false,
    thirdPartyInfo: false,
  });

  const navigate = useNavigate();

  const handleAllChecked = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setIndividualChecks({
      termsOfService: newCheckedState,
      privacyPolicy: newCheckedState,
      thirdPartyInfo: newCheckedState,
    });
  };

  const handleIndividualCheck = (key) => {
    setIndividualChecks((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    const allChecked =
      individualChecks.termsOfService &&
      individualChecks.privacyPolicy &&
      individualChecks.thirdPartyInfo;

    setAllChecked(allChecked);
  }, [individualChecks]);

  const handleNext = () => {
    navigate('/signup');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box position="relative" minHeight="100vh" fontFamily={'Pretendard'}>
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="뒤로가기"
        variant="ghost"
        position="absolute"
        top={4}
        left={2}
        onClick={handleBack}
      />
      <Flex direction="column" minHeight="100vh" justify="center">
        <Container maxW="400px">
          <VStack spacing={6} align="stretch">
            <Text fontSize="4xl" fontWeight="bold">
              반갑습니다,
            </Text>
            <Text mb={5}>
              착 서비스 이용을 위한 <br /> 약관 동의가 필요합니다.
            </Text>

            <VStack spacing={4} align="stretch">
              <Checkbox
                isChecked={allChecked}
                onChange={handleAllChecked}
                colorScheme="red"
                size="lg"
              >
                네, 모두 동의합니다.
              </Checkbox>
              <Divider />
              <Checkbox
                isChecked={individualChecks.termsOfService}
                onChange={() => handleIndividualCheck('termsOfService')}
                colorScheme="red"
              >
                서비스 이용약관 동의 (필수)
              </Checkbox>
              <Checkbox
                isChecked={individualChecks.privacyPolicy}
                onChange={() => handleIndividualCheck('privacyPolicy')}
                colorScheme="red"
              >
                개인정보 수집 및 이용 동의 (필수)
              </Checkbox>
              <Checkbox
                isChecked={individualChecks.thirdPartyInfo}
                onChange={() => handleIndividualCheck('thirdPartyInfo')}
                colorScheme="red"
              >
                개인정보 제3자 제공 동의 (필수)
              </Checkbox>
            </VStack>

            <Button
              mt={8}
              colorScheme="red"
              size="lg"
              isDisabled={!Object.values(individualChecks).every(Boolean)}
              onClick={handleNext}
              width="full"
            >
              다음
            </Button>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};

export default AgreementPage;
