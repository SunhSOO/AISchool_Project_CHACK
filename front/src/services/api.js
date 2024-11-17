// src/services/api.js

import { mapGender } from '../utils/genderUtils';

const API_URL = process.env.REACT_APP_API_URL;

const debugLog = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
};

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

  const userData = await response.json();
  debugLog('User data:', userData);
  return userData;
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
    const avatarsResponse = await fetch(`${API_URL}/avatars/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!avatarsResponse.ok) {
      throw new Error('아바타 목록 가져오기 실패');
    }

    const avatars = await avatarsResponse.json();
    debugLog('Fetched avatars:', avatars);

    const userData = await getCurrentUser();
    const userId = Number(userData.user_id);
    const gender = mapGender(userData.user_gender);

    const targetAvatar = avatars.find(
      (avatar) => Number(avatar.user_id) === userId
    );
    if (!targetAvatar) {
      throw new Error('해당 아바타를 찾을 수 없습니다.');
    }

    if (!targetAvatar.avatar_url) {
      throw new Error('아바타가 아직 생성되지 않았습니다.');
    }

    const baseTextureUrl = `${API_URL}/uploads/clothes/mtl`;

    const findAsset = (type) => ({
      obj:
        targetAvatar.fitting_urls.find((url) => url.includes(`_${type}.obj`)) ||
        null,
      tex: targetAvatar.fitting_urls.find((url) => url.includes(`_${type}.png`))
        ? `${baseTextureUrl}/${type}.png`
        : null,
    });

    const modelPaths = {
      body: { obj: targetAvatar.avatar_url },
      tshirt: findAsset('t-shirt'),
      pants: findAsset('pants'),
      shirt: findAsset('shirt'),
      shortPants: findAsset('short-pant'),
      skirt: gender === 'female' ? findAsset('skirt') : null,
    };

    debugLog('Model Paths:', modelPaths);

    return {
      avatarIndex: targetAvatar.avatar_idx,
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

/**
 * 의류 입기 (피팅 추가)
 */
export const addFitting = async (avatar_idx, clo_idx) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/fittings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar_idx, clo_idx }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '피팅 추가 실패');
  }

  return response.json();
};

/**
 * 의류 벗기 (피팅 삭제)
 */
export const removeFitting = async (fitting_idx) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const response = await fetch(`${API_URL}/fittings/${fitting_idx}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || '피팅 삭제 실패');
  }

  return;
};

export default {
  getCurrentUser,
  getAvatarData,
  uploadImage,
  updateMeasurements,
  fetchModels,
  getRecommendedSize,
  addFitting, // 추가
  removeFitting, // 추가
};
