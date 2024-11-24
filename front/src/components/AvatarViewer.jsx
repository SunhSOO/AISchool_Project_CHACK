import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Box,
  Text,
  Flex,
  Spinner,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';
import Scene from './Scene';
import Loader from './Loader';
import { useClothing } from '../contexts/ClothingContext';
import { getAvatarData } from '../services/api';
import { useToast } from '@chakra-ui/react';

const AvatarViewer = () => {
  const { activeClothing, updateClothing } = useClothing();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const loadAvatarData = async () => {
      try {
        const data = await getAvatarData();
        console.log('Loaded avatar data:', data);

        updateClothing({
          avatarIndex: data.avatarIndex,
          gender: data.gender,
          clo_3d: data.clo_3d,
        });

        console.log('Updated clo_3d:', data.clo_3d);
      } catch (error) {
        console.error('아바타 로드 실패:', error);
        setError(error.message || '아바타 로드에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatarData();
  }, [updateClothing]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAvatarData();
      console.log('Retrying to load avatar data:', data);

      updateClothing({
        avatarIndex: data.avatarIndex,
        gender: data.gender,
        clo_3d: data.clo_3d,
      });

      console.log('Updated clo_3d on retry:', data.clo_3d);
    } catch (err) {
      console.error('아바타 로드 실패:', err);
      setError(err.message || '아바타 로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        direction="column"
        color="red.500"
      >
        <Text mb={4}>{error}</Text>
        <Button onClick={handleRetry} colorScheme="blue">
          다시 시도
        </Button>
      </Flex>
    );
  }

  return (
    <Box position="relative" width="100%" height="100%" zIndex={1}>
      {/* 의류 토글 버튼 섹션 */}
      <Box position="absolute" top="10px" left="10px" zIndex={2}>
        <VStack spacing={2} align="start">
          {/* <Text fontWeight="bold" mb={2}>
            의류 토글
          </Text> */}
          {/* 
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme={activeClothing.showClothing ? 'green' : 'gray'}
              onClick={() => toggleClothing('Clothing')}
            >
              {activeClothing.showClothing ? 'T-Shirt 끄기' : 'T-Shirt 켜기'}
            </Button>
            <Button
              size="sm"
              colorScheme={activeClothing.showShirt ? 'green' : 'gray'}
              onClick={() => toggleClothing('Shirt')}
            >
              {activeClothing.showShirt ? 'Shirt 끄기' : 'Shirt 켜기'}
            </Button>
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme={activeClothing.showPant ? 'green' : 'gray'}
              onClick={() => toggleClothing('Pant')}
            >
              {activeClothing.showPant ? 'Pant 끄기' : 'Pant 켜기'}
            </Button>
            <Button
              size="sm"
              colorScheme={activeClothing.showShortPant ? 'green' : 'gray'}
              onClick={() => toggleClothing('ShortPant')}
            >
              {activeClothing.showShortPant
                ? 'Short Pant 끄기'
                : 'Short Pant 켜기'}
            </Button>
          </HStack>
          {activeClothing.gender === 'female' && (
            <Button
              size="sm"
              colorScheme={activeClothing.showSkirt ? 'green' : 'gray'}
              onClick={() => toggleClothing('Skirt')}
            >
              {activeClothing.showSkirt ? 'Skirt 끄기' : 'Skirt 켜기'}
            </Button>
          )}
          */}
        </VStack>
      </Box>

      <Canvas
        shadows
        camera={{
          position: [0, 0.5, 3],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: '#66666' }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minDistance={1.5}
          maxDistance={4}
          target={[0, 0, 0]}
        />

        <Suspense fallback={<Loader />}>
          <Scene
            showAvatar={true}
            showClothing={activeClothing.showClothing}
            showPant={activeClothing.showPant}
            showShortPant={activeClothing.showShortPant}
            showShirt={activeClothing.showShirt}
            showSkirt={activeClothing.showSkirt}
            gender={activeClothing.gender}
            clo_3d={activeClothing.clo_3d}
            avatarIndex={activeClothing.avatarIndex}
          />
        </Suspense>
      </Canvas>
    </Box>
  );
};

export default AvatarViewer;

// // src/components/AvatarViewer.jsx

// import React, { Suspense, useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import {
//   Box,
//   Text,
//   Flex,
//   Spinner,
//   Button,
//   VStack,
//   HStack,
// } from '@chakra-ui/react';
// import Scene from './Scene';
// import Loader from './Loader';
// import { useClothing } from '../contexts/ClothingContext';
// import { getAvatarData } from '../services/api';
// import { useToast } from '@chakra-ui/react';

// const AvatarViewer = () => {
//   const { activeClothing, updateClothing } = useClothing();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const toast = useToast();

//   useEffect(() => {
//     const loadAvatarData = async () => {
//       try {
//         const data = await getAvatarData();
//         console.log('Loaded avatar data:', data);

//         updateClothing({
//           avatarIndex: data.avatarIndex,
//           gender: data.gender,
//           clo_3d: data.clo_3d,
//         });

//         // clo_3d 구조 확인
//         console.log('Updated clo_3d:', data.clo_3d);
//       } catch (error) {
//         console.error('아바타 로드 실패:', error);
//         setError(error.message || '아바타 로드에 실패했습니다.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadAvatarData();
//   }, [updateClothing]);

//   const handleRetry = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await getAvatarData();
//       console.log('Retrying to load avatar data:', data);

//       updateClothing({
//         avatarIndex: data.avatarIndex,
//         gender: data.gender,
//         clo_3d: data.clo_3d,
//       });

//       // clo_3d 구조 확인
//       console.log('Updated clo_3d on retry:', data.clo_3d);
//     } catch (err) {
//       console.error('아바타 로드 실패:', err);
//       setError(err.message || '아바타 로드에 실패했습니다.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 의류 표시 상태를 토글하는 함수
//   const toggleClothing = (clothingType) => {
//     console.log(`Toggling ${clothingType}`);
//     const newState = !activeClothing[`show${clothingType}`];
//     console.log(`New state for show${clothingType}:`, newState);
//     updateClothing({
//       [`show${clothingType}`]: newState,
//     });
//   };

//   if (isLoading) {
//     return (
//       <Flex
//         width="100%"
//         height="100%"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <Spinner size="xl" color="blue.500" />
//       </Flex>
//     );
//   }

//   if (error) {
//     return (
//       <Flex
//         width="100%"
//         height="100%"
//         justifyContent="center"
//         alignItems="center"
//         direction="column"
//         color="red.500"
//       >
//         <Text mb={4}>{error}</Text>
//         <Button onClick={handleRetry} colorScheme="blue">
//           다시 시도
//         </Button>
//       </Flex>
//     );
//   }

//   return (
//     <Box position="relative" width="100%" height="100%" zIndex={1}>
//       {/* 의류 토글 버튼 섹션 */}
//       <Box position="absolute" top="10px" left="10px" zIndex={2}>
//         <VStack spacing={2} align="start">
//           <Text fontWeight="bold" mb={2}>
//             의류 토글
//           </Text>
//           <HStack spacing={2}>
//             <Button
//               size="sm"
//               colorScheme={activeClothing.showClothing ? 'green' : 'gray'}
//               onClick={() => toggleClothing('Clothing')}
//             >
//               {activeClothing.showClothing ? 'T-Shirt 끄기' : 'T-Shirt 켜기'}
//             </Button>
//             <Button
//               size="sm"
//               colorScheme={activeClothing.showShirt ? 'green' : 'gray'}
//               onClick={() => toggleClothing('Shirt')}
//             >
//               {activeClothing.showShirt ? 'Shirt 끄기' : 'Shirt 켜기'}
//             </Button>
//           </HStack>
//           <HStack spacing={2}>
//             <Button
//               size="sm"
//               colorScheme={activeClothing.showPant ? 'green' : 'gray'}
//               onClick={() => toggleClothing('Pant')}
//             >
//               {activeClothing.showPant ? 'Pant 끄기' : 'Pant 켜기'}
//             </Button>
//             <Button
//               size="sm"
//               colorScheme={activeClothing.showShortPant ? 'green' : 'gray'}
//               onClick={() => toggleClothing('ShortPant')}
//             >
//               {activeClothing.showShortPant
//                 ? 'Short Pant 끄기'
//                 : 'Short Pant 켜기'}
//             </Button>
//           </HStack>
//           {activeClothing.gender === 'female' && (
//             <Button
//               size="sm"
//               colorScheme={activeClothing.showSkirt ? 'green' : 'gray'}
//               onClick={() => toggleClothing('Skirt')}
//             >
//               {activeClothing.showSkirt ? 'Skirt 끄기' : 'Skirt 켜기'}
//             </Button>
//           )}
//         </VStack>
//       </Box>

//       <Canvas
//         shadows
//         camera={{
//           position: [0, 0.5, 3],
//           fov: 45,
//           near: 0.1,
//           far: 1000,
//         }}
//         style={{ background: '#f0f0f0' }}
//         gl={{
//           antialias: true,
//           powerPreference: 'high-performance',
//         }}
//       >
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
//         <pointLight position={[10, 10, 10]} intensity={0.5} />

//         <OrbitControls
//           enableZoom
//           enablePan
//           enableRotate
//           minPolarAngle={0}
//           maxPolarAngle={Math.PI}
//           minDistance={1.5}
//           maxDistance={4}
//           target={[0, 0, 0]}
//         />

//         <Suspense fallback={<Loader />}>
//           <Scene
//             showAvatar={true}
//             showClothing={activeClothing.showClothing}
//             showPant={activeClothing.showPant}
//             showShortPant={activeClothing.showShortPant}
//             showShirt={activeClothing.showShirt}
//             showSkirt={activeClothing.showSkirt}
//             gender={activeClothing.gender}
//             clo_3d={activeClothing.clo_3d}
//             avatarIndex={activeClothing.avatarIndex}
//           />
//         </Suspense>
//       </Canvas>
//     </Box>
//   );
// };

// export default AvatarViewer;
