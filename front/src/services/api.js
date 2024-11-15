// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL;

/**
 * 현재 로그인한 사용자의 정보 가져오기
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('사용자 정보 가져오기 실패');
  }

  return response.json();
};

/**
 * 유저의 아바타 데이터 가져오기
 */
export const getAvatarData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  try {
    // 1. 먼저 현재 사용자 정보를 가져옵니다.
    const userData = await getCurrentUser();
    const avatarIndex = userData.avatar_idx || '28'; // 기본값 28
    const gender = userData.gender || 'female'; // 기본값 female

    // 2. 아바타 상태를 확인합니다.
    const statusResponse = await fetch(
      `${API_URL}/avatar-status/${avatarIndex}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error('아바타 상태 확인 실패');
    }

    const statusData = await statusResponse.json();

    if (!statusData.is_generated) {
      throw new Error('아바타가 아직 생성되지 않았습니다.');
    }

    // 3. 실제 경로 구성
    const modelPaths = {
      body: {
        obj: `${API_URL}/uploads/avatars/models/body_${avatarIndex}_${gender}.obj`,
      },
      tshirt: {
        obj: `${API_URL}/uploads/fittings/garment_${avatarIndex}_${gender}_tshirt.obj`,
      },
      pants: {
        obj: `${API_URL}/uploads/fittings/garment_${avatarIndex}_${gender}_pants.obj`,
      },
      shirt: {
        obj: `${API_URL}/uploads/fittings/garment_${avatarIndex}_${gender}_shirt.obj`,
      },
      shortPants: {
        obj: `${API_URL}/uploads/fittings/garment_${avatarIndex}_${gender}_shortpants.obj`,
      },
    };

    // 여성일 경우에만 스커트 추가
    if (gender === 'female') {
      modelPaths.skirt = {
        obj: `${API_URL}/uploads/fittings/garment_${avatarIndex}_${gender}_skirt.obj`,
      };
    }

    return {
      avatarIndex,
      gender,
      clo_3d: modelPaths,
    };
  } catch (error) {
    console.error('아바타 데이터 가져오기 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 이미지 업로드
 */
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('img_file', imageFile);

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/uploads/avatars/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드 실패');
  }

  return response.json();
};

/**
 * 측정값 업데이트
 */
export const updateMeasurements = async (data) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/measurements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('측정값 업데이트 실패');
  }

  return response.json();
};

/**
 * 아바타 상태 확인
 */
export const checkAvatarStatus = async (avatarIndex) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/avatar-status/${avatarIndex}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('아바타 상태 확인 실패');
  }

  return response.json();
};

/**
 * 모델 가져오기
 */
export const fetchModels = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/models`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('모델 가져오기 실패');
  }

  return response.json();
};

/**
 * 사이즈 추천 받기
 */
export const getRecommendedSize = async (measurements) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/recommend-size`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(measurements),
  });

  if (!response.ok) {
    throw new Error('사이즈 추천 실패');
  }

  return response.json();
};

export default {
  getCurrentUser,
  getAvatarData,
  uploadImage,
  updateMeasurements,
  checkAvatarStatus,
  fetchModels,
  getRecommendedSize,
};
