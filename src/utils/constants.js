// API 기본 설정
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_INFO: 'userInfo',
  WORKOUT_DATA: 'workoutData',
};

// 날짜 포맷팅 유틸리티
export const formatDate = date => {
  return new Date(date).toLocaleDateString('ko-KR');
};

// 시간 포맷팅 유틸리티
export const formatTime = minutes => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
};
