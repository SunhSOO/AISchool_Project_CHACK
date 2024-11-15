// // src/components/MeasurementForm.jsx
// import React, { useState } from 'react';
// import { Box, Input, VStack, Button, Text, HStack } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import AvatarLoading from './AvatarLoading'; // 로딩 컴포넌트 import
// import { useMeasurements } from '../contexts/UserMeasurementContext';
// import { updateMeasurements as apiUpdateMeasurements } from '../services/api'; // API 호출 import

// const MeasurementForm = () => {
//   const { measurements, updateMeasurements } = useMeasurements();
//   const [localMeasurements, setLocalMeasurements] = useState({
//     height: measurements.height || '',
//     weight: measurements.weight || '',
//   });
//   const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setLocalMeasurements({
//       ...localMeasurements,
//       [name]: value,
//     });
//   };

//   const handleSubmit = () => {
//     // 단순 알림 대신 유효성 검사 추가 가능
//     if (!localMeasurements.height || !localMeasurements.weight) {
//       setError('모든 필드를 입력해주세요.');
//       return;
//     }
//     setError(null);
//   };

//   const handleConfirm = async () => {
//     if (!localMeasurements.height || !localMeasurements.weight) {
//       setError('모든 필드를 입력해주세요.');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // API를 통해 측정값 업데이트
//       await apiUpdateMeasurements({
//         height: localMeasurements.height,
//         weight: localMeasurements.weight,
//         avatarIndex: measurements.avatarIndex,
//         gender: measurements.gender,
//       });

//       // 컨텍스트 업데이트
//       updateMeasurements({
//         height: localMeasurements.height,
//         weight: localMeasurements.weight,
//         isAvatarGenerated: true, // 아바타 생성 완료 표시
//       });

//       // 로딩 화면 표시 후 쇼핑 페이지로 이동
//       // 실제 아바타 생성 시간이 오래 걸리므로, 여기서는 시뮬레이션을 위해 5초 후 이동
//       setTimeout(() => {
//         navigate('/shopping');
//       }, 5000); // 5초 후 이동
//     } catch (err) {
//       setError('측정값 업데이트 중 오류가 발생했습니다: ' + err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <AvatarLoading />;
//   }

//   return (
//     <Box maxW="500px" p={4} mx="auto" fontFamily="Pretendard" mt={20}>
//       <Text fontSize="2xl" fontWeight="bold" mb={4}>
//         신체 정보
//       </Text>
//       {error && (
//         <Text color="red.500" mb={4}>
//           {error}
//         </Text>
//       )}
//       <VStack spacing={4} align="stretch">
//         <HStack>
//           <Text whiteSpace="nowrap">키</Text>
//           <Input
//             placeholder="cm"
//             name="height"
//             value={localMeasurements.height}
//             onChange={handleInputChange}
//             size="sm"
//             variant="flushed"
//           />
//         </HStack>
//         <HStack>
//           <Text whiteSpace="nowrap">몸무게</Text>
//           <Input
//             placeholder="kg"
//             name="weight"
//             value={localMeasurements.weight}
//             onChange={handleInputChange}
//             size="sm"
//             variant="flushed"
//           />
//         </HStack>

//         <HStack spacing={4} mt={4} width="100%">
//           <Button colorScheme="red" onClick={handleSubmit} flex="1">
//             수정
//           </Button>
//           <Button colorScheme="red" onClick={handleConfirm} flex="1">
//             확인
//           </Button>
//         </HStack>
//       </VStack>
//     </Box>
//   );
// };

// export default MeasurementForm;
// src/components/MeasurementForm.jsx
import React from 'react';
import { Box, VStack, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMeasurements } from '../contexts/UserMeasurementContext';

const MeasurementForm = () => {
  const { updateMeasurements } = useMeasurements();
  const navigate = useNavigate();

  // 다음 페이지로 이동하는 핸들러
  const handleProceed = () => {
    // 필요한 경우 컨텍스트 업데이트
    updateMeasurements({
      // 여기서 필요한 데이터를 업데이트할 수 있습니다.
      isAvatarGenerated: true, // 예시로 아바타 생성 완료 표시
    });
    navigate('/shopping'); // 다음 페이지 경로로 변경하세요
  };

  return (
    <Box maxW="500px" p={4} mx="auto" fontFamily="Pretendard" mt={20}>
      <VStack spacing={6} align="center">
        <Text fontSize="2xl" fontWeight="bold">
          신체 정보
        </Text>
        <Text fontSize="lg">
          측정값 입력을 생략하고 다음 페이지로 이동합니다.
        </Text>
        <Button colorScheme="blue" onClick={handleProceed}>
          다음으로 이동
        </Button>
      </VStack>
    </Box>
  );
};

export default MeasurementForm;
