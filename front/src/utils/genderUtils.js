// src/utils/genderUtils.js

export const mapGender = (gender) => {
  switch (gender) {
    case 'M':
      return 'male';
    case 'F':
      return 'female';
    default:
      return 'female'; // 기본값 설정
  }
};
