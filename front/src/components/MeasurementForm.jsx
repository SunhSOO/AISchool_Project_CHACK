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

// src/components/MeasurementForm.jsx
// src/components/MeasurementForm.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Button,
  Text,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMeasurements } from '../contexts/UserMeasurementContext';
import AvatarSelectionModal from './AvatarSelectionModal';

const MeasurementForm = () => {
  const { measurements, updateMeasurements } = useMeasurements();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chestCircumference, setChestCircumference] = useState(
    measurements.chestCircumference || ''
  );
  const [waistCircumference, setWaistCircumference] = useState(
    measurements.waistCircumference || ''
  );
  const [hipCircumference, setHipCircumference] = useState(
    measurements.hipCircumference || ''
  );

  const [isLoading, setIsLoading] = useState(false);

  // 신체치수 업데이트 컨트롤러
  const handleUpdateMeasurements = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      // FormData 객체 생성 및 데이터 추가
      const formData = new FormData();
      formData.append('chest_circumference', chestCircumference);
      formData.append('waist_circumference', waistCircumference);
      formData.append('hip_circumference', hipCircumference);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/avatars/${measurements.avatarIndex}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`, // FormData는 Content-Type을 자동 설정
          },
          body: formData, // FormData를 요청 본문에 추가
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.detail || '업데이트 실패';
        } catch (e) {
          errorMessage = '서버 응답 처리 중 오류가 발생했습니다';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Update Result:', result);

      updateMeasurements({
        chestCircumference: result.chest_circumference,
        waistCircumference: result.waist_circumference,
        hipCircumference: result.hip_circumference,
        isAvatarGenerated: true,
      });

      toast({
        title: '업데이트 성공',
        description: '측정값이 성공적으로 업데이트되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 모달 열기
      onOpen();
    } catch (err) {
      console.error('Update error:', err);
      toast({
        title: '업데이트 실패',
        description: err.message || '알 수 없는 오류가 발생했습니다.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 모달에서 확인 버튼을 누르면 쇼핑 페이지로 이동
  const handleConfirm = () => {
    onClose();
    navigate('/shopping'); // 쇼핑 페이지로 이동
  };

  return (
    <Box maxW="500px" p={4} mx="auto" fontFamily="Pretendard" mt={20}>
      <VStack spacing={6} align="center">
        <Text fontSize="2xl" fontWeight="bold">
          신체 치수 확인 및 수정
        </Text>

        <FormControl id="chestCircumference">
          <FormLabel>가슴둘레 (cm)</FormLabel>
          <NumberInput
            value={chestCircumference}
            onChange={(valueString) => setChestCircumference(valueString)}
            min={50}
            max={150}
          >
            <NumberInputField placeholder="가슴둘레를 입력하세요" />
          </NumberInput>
        </FormControl>

        <FormControl id="waistCircumference">
          <FormLabel>허리둘레 (cm)</FormLabel>
          <NumberInput
            value={waistCircumference}
            onChange={(valueString) => setWaistCircumference(valueString)}
            min={40}
            max={130}
          >
            <NumberInputField placeholder="허리둘레를 입력하세요" />
          </NumberInput>
        </FormControl>

        <FormControl id="hipCircumference">
          <FormLabel>엉덩이둘레 (cm)</FormLabel>
          <NumberInput
            value={hipCircumference}
            onChange={(valueString) => setHipCircumference(valueString)}
            min={50}
            max={150}
          >
            <NumberInputField placeholder="엉덩이둘레를 입력하세요" />
          </NumberInput>
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleUpdateMeasurements}
          isLoading={isLoading}
        >
          다음으로 이동
        </Button>
      </VStack>

      {/* 아바타 확인 모달 */}
      <AvatarSelectionModal
        isOpen={isOpen}
        onClose={handleConfirm}
        avatarIndex={measurements.avatarIndex}
      />
    </Box>
  );
};

export default MeasurementForm;
