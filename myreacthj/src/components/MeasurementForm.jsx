import React, { useState } from 'react';
import { Box, Input, VStack, Button, Text, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const MeasurementForm = () => {
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
  });

  const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동 처리

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurements({
      ...measurements,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    alert(
      `가슴둘레: ${measurements.chest}cm, 허리둘레: ${measurements.waist}cm, 엉덩이둘레: ${measurements.hips}cm`
    );
  };

  const handleConfirm = () => {
    alert('사이즈가 확인되었습니다.');
    navigate('/ShoppingPage'); // 확인 버튼 클릭 시 ShoppingPage로 이동
  };

  return (
    <Box maxW="500px" p={4} mx="auto" fontFamily="Pretendard" mt={20}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        측정 사이즈
      </Text>
      <VStack spacing={4} align="stretch">
        <HStack>
          <Text whiteSpace="nowrap">가슴 둘레</Text>
          <Input
            placeholder="cm"
            name="chest"
            value={measurements.chest}
            onChange={handleInputChange}
            size="sm"
            variant="flushed"
          />
        </HStack>
        <HStack>
          <Text whiteSpace="nowrap">허리 둘레</Text>
          <Input
            placeholder="cm"
            name="waist"
            value={measurements.waist}
            onChange={handleInputChange}
            size="sm"
            variant="flushed"
          />
        </HStack>
        <HStack>
          <Text whiteSpace="nowrap">엉덩이 둘레</Text>
          <Input
            placeholder="cm"
            name="hips"
            value={measurements.hips}
            onChange={handleInputChange}
            size="sm"
            variant="flushed"
          />
        </HStack>

        <HStack spacing={4} mt={4} width="100%">
          <Button colorScheme="red" onClick={handleSubmit} flex="1">
            수정
          </Button>
          <Button colorScheme="red" onClick={handleConfirm} flex="1">
            확인
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MeasurementForm;
