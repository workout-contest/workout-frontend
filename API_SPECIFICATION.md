# 헬스케어 웹앱 API 명세서

## 📋 개요

BMI 분석과 동영상 추천을 통한 개인 맞춤형 건강 관리 서비스의 백엔드 API 명세서입니다.

**Base URL**: `https://api.healthcare-app.com/v1`

## 🔐 인증

### JWT 토큰 기반 인증
- **Header**: `Authorization: Bearer <token>`
- **토큰 만료**: 24시간
- **리프레시 토큰**: 7일

## 📊 데이터 모델

### User (사용자)
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "age": "number",
  "gender": "string", // "male" | "female"
  "height": "number", // cm
  "weight": "number", // kg
  "bmi": "number",
  "bmiCategory": "string", // "저체중" | "정상" | "과체중" | "비만"
  "createdAt": "string", // ISO 8601
  "updatedAt": "string" // ISO 8601
}
```

### Workout (운동)
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "duration": "number", // 분
  "difficulty": "string", // "초급" | "중급" | "고급"
  "category": "string", // "유산소" | "근력운동" | "요가" | "스트레칭" | "필라테스"
  "calories": "number",
  "videoUrl": "string",
  "thumbnailUrl": "string",
  "icon": "string",
  "createdAt": "string"
}
```

### WorkoutPlan (운동 계획)
```json
{
  "id": "string",
  "userId": "string",
  "goal": "string",
  "duration": "string", // "4주"
  "difficulty": "string",
  "weeklySchedule": [
    {
      "day": "string",
      "workout": "string",
      "duration": "string",
      "completed": "boolean"
    }
  ],
  "exercises": [
    {
      "name": "string",
      "icon": "string",
      "details": "string"
    }
  ],
  "createdAt": "string"
}
```

### Progress (진행 상황)
```json
{
  "id": "string",
  "userId": "string",
  "totalWorkouts": "number",
  "weeklyGoal": "number",
  "completedThisWeek": "number",
  "streak": "number",
  "totalMinutes": "number",
  "caloriesBurned": "number",
  "weeklyData": [
    {
      "day": "string",
      "minutes": "number",
      "completed": "boolean"
    }
  ],
  "updatedAt": "string"
}
```

### Achievement (성취)
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "description": "string",
  "icon": "string",
  "points": "number",
  "progress": "number", // 0-100
  "earned": "boolean",
  "earnedAt": "string",
  "createdAt": "string"
}
```

### Post (게시글)
```json
{
  "id": "string",
  "userId": "string",
  "userName": "string",
  "userAvatar": "string",
  "content": "string",
  "likes": "number",
  "comments": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Challenge (챌린지)
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "icon": "string",
  "participants": "number",
  "startDate": "string",
  "endDate": "string",
  "createdAt": "string"
}
```

## 🚀 API 엔드포인트

### 1. 사용자 관리

#### 1.1 사용자 등록
```http
POST /auth/register
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "홍길동",
      "email": "hong@example.com",
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "bmi": 22.86,
      "bmiCategory": "정상"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### 1.2 사용자 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "email": "hong@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "홍길동",
      "email": "hong@example.com",
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "bmi": 22.86,
      "bmiCategory": "정상"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### 1.3 사용자 정보 조회
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "홍길동",
      "email": "hong@example.com",
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "bmi": 22.86,
      "bmiCategory": "정상",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 1.4 사용자 정보 수정
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "홍길동",
  "age": 26,
  "height": 176,
  "weight": 72
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "홍길동",
      "email": "hong@example.com",
      "age": 26,
      "gender": "male",
      "height": 176,
      "weight": 72,
      "bmi": 23.24,
      "bmiCategory": "정상",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2. 동영상 추천

#### 2.1 동영상 목록 조회
```http
GET /videos?category=유산소&difficulty=초급&page=1&limit=10
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "video_1",
        "title": "초보자를 위한 기본 유산소 운동",
        "description": "체력 향상과 체중 감량에 효과적인 기본 유산소 운동입니다.",
        "duration": 20,
        "difficulty": "초급",
        "category": "유산소",
        "calories": 150,
        "videoUrl": "https://cdn.example.com/videos/basic_cardio.mp4",
        "thumbnailUrl": "https://cdn.example.com/thumbnails/basic_cardio.jpg",
        "icon": "🏃‍♂️",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 2.2 맞춤 동영상 추천
```http
GET /videos/recommendations
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "video_1",
        "title": "초보자를 위한 기본 유산소 운동",
        "description": "체력 향상과 체중 감량에 효과적인 기본 유산소 운동입니다.",
        "duration": 20,
        "difficulty": "초급",
        "category": "유산소",
        "calories": 150,
        "videoUrl": "https://cdn.example.com/videos/basic_cardio.mp4",
        "thumbnailUrl": "https://cdn.example.com/thumbnails/basic_cardio.jpg",
        "icon": "🏃‍♂️",
        "reason": "BMI 기반 맞춤 추천"
      }
    ]
  }
}
```

#### 2.3 동영상 재생 기록
```http
POST /videos/{videoId}/play
Authorization: Bearer <token>
Content-Type: application/json

{
  "duration": 20,
  "completed": true
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "message": "동영상 재생 기록이 저장되었습니다.",
    "points": 10
  }
}
```

### 3. 운동 계획

#### 3.1 운동 계획 생성
```http
POST /workout-plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "goal": "체중 감량",
  "duration": "4주",
  "difficulty": "초급"
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "plan_123",
      "userId": "user_123",
      "goal": "체중 감량",
      "duration": "4주",
      "difficulty": "초급",
      "weeklySchedule": [
        {
          "day": "월요일",
          "workout": "유산소 운동",
          "duration": "30분",
          "completed": false
        }
      ],
      "exercises": [
        {
          "name": "스쿼트",
          "icon": "🦵",
          "details": "3세트 x 15회"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 3.2 운동 계획 조회
```http
GET /workout-plans
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "plan_123",
      "userId": "user_123",
      "goal": "체중 감량",
      "duration": "4주",
      "difficulty": "초급",
      "weeklySchedule": [
        {
          "day": "월요일",
          "workout": "유산소 운동",
          "duration": "30분",
          "completed": true
        }
      ],
      "exercises": [
        {
          "name": "스쿼트",
          "icon": "🦵",
          "details": "3세트 x 15회"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 3.3 운동 완료 체크
```http
PUT /workout-plans/{planId}/schedule/{dayIndex}
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "message": "운동이 완료되었습니다.",
    "points": 20,
    "streak": 3
  }
}
```

### 4. 진행 상황 추적

#### 4.1 진행 상황 조회
```http
GET /progress
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "progress": {
      "id": "progress_123",
      "userId": "user_123",
      "totalWorkouts": 15,
      "weeklyGoal": 5,
      "completedThisWeek": 3,
      "streak": 7,
      "totalMinutes": 450,
      "caloriesBurned": 2100,
      "weeklyData": [
        {
          "day": "월",
          "minutes": 30,
          "completed": true
        }
      ],
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 4.2 진행 상황 업데이트
```http
PUT /progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "workoutMinutes": 30,
  "caloriesBurned": 150
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "progress": {
      "id": "progress_123",
      "userId": "user_123",
      "totalWorkouts": 16,
      "weeklyGoal": 5,
      "completedThisWeek": 4,
      "streak": 8,
      "totalMinutes": 480,
      "caloriesBurned": 2250,
      "weeklyData": [
        {
          "day": "월",
          "minutes": 30,
          "completed": true
        }
      ],
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 5. 성취 시스템

#### 5.1 성취 목록 조회
```http
GET /achievements
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "achievement_1",
        "userId": "user_123",
        "title": "첫 걸음",
        "description": "첫 번째 운동을 완료하세요",
        "icon": "👶",
        "points": 50,
        "progress": 100,
        "earned": true,
        "earnedAt": "2024-01-10T10:30:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "totalPoints": 1250,
    "currentLevel": 3,
    "nextLevelPoints": 500
  }
}
```

#### 5.2 성취 달성 확인
```http
GET /achievements/{achievementId}
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "achievement": {
      "id": "achievement_1",
      "userId": "user_123",
      "title": "첫 걸음",
      "description": "첫 번째 운동을 완료하세요",
      "icon": "👶",
      "points": 50,
      "progress": 100,
      "earned": true,
      "earnedAt": "2024-01-10T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 6. 커뮤니티

#### 6.1 게시글 목록 조회
```http
GET /posts?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_1",
        "userId": "user_123",
        "userName": "김운동",
        "userAvatar": "김",
        "content": "오늘 첫 번째 5km 달리기를 완주했습니다! 정말 힘들었지만 성취감이 대단해요.",
        "likes": 12,
        "comments": 3,
        "createdAt": "2024-01-15T08:30:00Z",
        "updatedAt": "2024-01-15T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 6.2 게시글 작성
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "오늘 운동 완료! 정말 뿌듯합니다."
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post_123",
      "userId": "user_123",
      "userName": "홍길동",
      "userAvatar": "홍",
      "content": "오늘 운동 완료! 정말 뿌듯합니다.",
      "likes": 0,
      "comments": 0,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 6.3 게시글 좋아요
```http
POST /posts/{postId}/like
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "message": "좋아요가 추가되었습니다.",
    "likes": 13
  }
}
```

#### 6.4 댓글 작성
```http
POST /posts/{postId}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "화이팅! 저도 열심히 해야겠어요."
}
```

**Response (201)**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_123",
      "postId": "post_1",
      "userId": "user_123",
      "userName": "홍길동",
      "content": "화이팅! 저도 열심히 해야겠어요.",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 6.5 챌린지 목록 조회
```http
GET /challenges
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "challenge_1",
        "title": "30일 챌린지",
        "description": "30일 동안 매일 운동하기",
        "icon": "🔥",
        "participants": 156,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-01-31T23:59:59Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### 6.6 챌린지 참여
```http
POST /challenges/{challengeId}/join
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "message": "챌린지에 참여하셨습니다.",
    "participants": 157
  }
}
```

### 7. 영양 가이드

#### 7.1 영양소 정보 조회
```http
GET /nutrition/macros
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "macros": [
      {
        "name": "탄수화물",
        "amount": 200,
        "unit": "g",
        "icon": "🍞"
      },
      {
        "name": "단백질",
        "amount": 120,
        "unit": "g",
        "icon": "🥩"
      },
      {
        "name": "지방",
        "amount": 60,
        "unit": "g",
        "icon": "🥑"
      },
      {
        "name": "섬유질",
        "amount": 25,
        "unit": "g",
        "icon": "🥬"
      }
    ]
  }
}
```

#### 7.2 추천 식단 조회
```http
GET /nutrition/meals
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "meals": {
      "breakfast": [
        {
          "name": "오트밀",
          "calories": "150kcal",
          "icon": "🥣"
        }
      ],
      "lunch": [
        {
          "name": "현미밥",
          "calories": "200kcal",
          "icon": "🍚"
        }
      ],
      "dinner": [
        {
          "name": "연어",
          "calories": "180kcal",
          "icon": "🐟"
        }
      ],
      "snack": [
        {
          "name": "그릭요거트",
          "calories": "100kcal",
          "icon": "🥛"
        }
      ]
    }
  }
}
```

#### 7.3 수분 섭취 기록
```http
POST /nutrition/water-intake
Authorization: Bearer <token>
Content-Type: application/json

{
  "glasses": 5
}
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "message": "수분 섭취가 기록되었습니다.",
    "totalGlasses": 5,
    "goal": 8
  }
}
```

## 🔧 에러 처리

### 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "이메일 형식이 올바르지 않습니다."
      }
    ]
  }
}
```

### 에러 코드
- `VALIDATION_ERROR`: 입력값 검증 오류
- `AUTHENTICATION_ERROR`: 인증 오류
- `AUTHORIZATION_ERROR`: 권한 오류
- `NOT_FOUND`: 리소스를 찾을 수 없음
- `DUPLICATE_ERROR`: 중복 데이터 오류
- `SERVER_ERROR`: 서버 내부 오류

## 📱 프론트엔드 연동 가이드

### 1. API 클라이언트 설정
```javascript
// src/services/api.js
const API_BASE_URL = 'https://api.healthcare-app.com/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 요청 실패');
    }

    return data;
  }

  // GET 요청
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 요청
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 요청
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();
```

### 2. 사용자 인증 서비스
```javascript
// src/services/authService.js
import apiClient from './api';

export const authService = {
  // 회원가입
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  // 로그인
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  // 로그아웃
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  // 사용자 정보 조회
  async getProfile() {
    return apiClient.get('/users/profile');
  },

  // 사용자 정보 수정
  async updateProfile(userData) {
    return apiClient.put('/users/profile', userData);
  }
};
```

### 3. 동영상 서비스
```javascript
// src/services/videoService.js
import apiClient from './api';

export const videoService = {
  // 동영상 목록 조회
  async getVideos(filters = {}) {
    const params = new URLSearchParams(filters);
    return apiClient.get(`/videos?${params}`);
  },

  // 맞춤 동영상 추천
  async getRecommendations() {
    return apiClient.get('/videos/recommendations');
  },

  // 동영상 재생 기록
  async recordPlay(videoId, duration, completed) {
    return apiClient.post(`/videos/${videoId}/play`, { duration, completed });
  }
};
```

### 4. 운동 계획 서비스
```javascript
// src/services/workoutService.js
import apiClient from './api';

export const workoutService = {
  // 운동 계획 생성
  async createPlan(planData) {
    return apiClient.post('/workout-plans', planData);
  },

  // 운동 계획 조회
  async getPlan() {
    return apiClient.get('/workout-plans');
  },

  // 운동 완료 체크
  async completeWorkout(planId, dayIndex, completed) {
    return apiClient.put(`/workout-plans/${planId}/schedule/${dayIndex}`, { completed });
  }
};
```

### 5. 진행 상황 서비스
```javascript
// src/services/progressService.js
import apiClient from './api';

export const progressService = {
  // 진행 상황 조회
  async getProgress() {
    return apiClient.get('/progress');
  },

  // 진행 상황 업데이트
  async updateProgress(workoutMinutes, caloriesBurned) {
    return apiClient.put('/progress', { workoutMinutes, caloriesBurned });
  }
};
```

### 6. 성취 서비스
```javascript
// src/services/achievementService.js
import apiClient from './api';

export const achievementService = {
  // 성취 목록 조회
  async getAchievements() {
    return apiClient.get('/achievements');
  },

  // 성취 상세 조회
  async getAchievement(achievementId) {
    return apiClient.get(`/achievements/${achievementId}`);
  }
};
```

### 7. 커뮤니티 서비스
```javascript
// src/services/communityService.js
import apiClient from './api';

export const communityService = {
  // 게시글 목록 조회
  async getPosts(page = 1, limit = 10) {
    return apiClient.get(`/posts?page=${page}&limit=${limit}`);
  },

  // 게시글 작성
  async createPost(content) {
    return apiClient.post('/posts', { content });
  },

  // 게시글 좋아요
  async likePost(postId) {
    return apiClient.post(`/posts/${postId}/like`);
  },

  // 댓글 작성
  async createComment(postId, content) {
    return apiClient.post(`/posts/${postId}/comments`, { content });
  },

  // 챌린지 목록 조회
  async getChallenges() {
    return apiClient.get('/challenges');
  },

  // 챌린지 참여
  async joinChallenge(challengeId) {
    return apiClient.post(`/challenges/${challengeId}/join`);
  }
};
```

### 8. 영양 서비스
```javascript
// src/services/nutritionService.js
import apiClient from './api';

export const nutritionService = {
  // 영양소 정보 조회
  async getMacros() {
    return apiClient.get('/nutrition/macros');
  },

  // 추천 식단 조회
  async getMeals() {
    return apiClient.get('/nutrition/meals');
  },

  // 수분 섭취 기록
  async recordWaterIntake(glasses) {
    return apiClient.post('/nutrition/water-intake', { glasses });
  }
};
```

## 🚀 배포 및 환경 설정

### 환경 변수
```env
# .env
REACT_APP_API_BASE_URL=https://api.healthcare-app.com/v1
REACT_APP_ENVIRONMENT=production
```

### 프론트엔드 환경별 설정
```javascript
// src/config/index.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001/v1',
  },
  production: {
    API_BASE_URL: 'https://api.healthcare-app.com/v1',
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

## 📊 성능 최적화

### 1. 캐싱 전략
- 사용자 정보: 5분 캐시
- 동영상 목록: 10분 캐시
- 운동 계획: 1시간 캐시
- 진행 상황: 실시간 업데이트

### 2. 이미지 최적화
- 동영상 썸네일: WebP 형식 사용
- 아바타: 50x50px 최적화
- 아이콘: SVG 형식 사용

### 3. API 호출 최적화
- 배치 요청 사용
- 무한 스크롤 구현
- 디바운싱 적용

## 🔒 보안 고려사항

### 1. 인증 보안
- JWT 토큰 만료 시간: 24시간
- 리프레시 토큰: 7일
- HTTPS 필수 사용

### 2. 데이터 보안
- 개인정보 암호화 저장
- API 요청 로깅
- SQL 인젝션 방지

### 3. 프론트엔드 보안
- XSS 방지
- CSRF 토큰 사용
- 민감한 정보 로컬스토리지 저장 금지

이 API 명세서를 바탕으로 백엔드 개발자가 실제 서비스를 구현할 수 있습니다. 프론트엔드에서는 제공된 서비스 함수들을 사용하여 API와 연동할 수 있습니다.
