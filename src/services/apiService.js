/**
 * API 서비스
 * 백엔드와의 통신을 담당합니다.
 */

import tokenManager from '../utils/tokenManager';

const API_BASE_URL = 'https://euics.kr';

class ApiService {
  /**
   * 기본 fetch 요청 래퍼
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} options - fetch 옵션
   * @returns {Promise<Object>} API 응답
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // 액세스 토큰이 있으면 Authorization 헤더 추가
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      defaultOptions.headers.Authorization = `Bearer ${accessToken}`;
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API 응답 오류:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: url,
          config: config,
        });
        console.error('서버 오류 상세:', JSON.stringify(data, null, 2));
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }

  /**
   * GET 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} API 응답
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} data - 요청 데이터
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} API 응답
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} data - 요청 데이터
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} API 응답
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} options - 추가 옵션
   * @returns {Promise<Object>} API 응답
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * 회원가입
   * @param {Object} userData - 사용자 데이터
   * @param {string} userData.name - 이름
   * @param {number} userData.age - 나이
   * @param {string} userData.gender - 성별
   * @param {number} userData.height - 키 (cm)
   * @param {number} userData.weight - 몸무게 (kg)
   * @returns {Promise<Object>} 회원가입 응답
   */
  async signup(userData) {
    try {
      const response = await this.post('/signup', userData);

      // 회원가입 응답에는 토큰이 없으므로 토큰 저장하지 않음
      // 토큰은 로그인 시에만 저장됨

      return response;
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  }

  /**
   * 로그인
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   * @returns {Promise<Object>} 로그인 응답
   */
  async login(credentials) {
    try {
      const response = await this.post('/login', credentials);

      // 토큰 정보 저장
      if (response.data && response.data.access_token) {
        // JWT 토큰에서 user_id 추출
        const tokenPayload = JSON.parse(
          atob(response.data.access_token.split('.')[1])
        );
        const userId = tokenPayload.user_id;

        tokenManager.setTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          user_id: userId,
        });
      }

      return response;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  }

  /**
   * 토큰 갱신
   * @returns {Promise<Object>} 토큰 갱신 응답
   */
  async refreshToken() {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await this.post('/refresh', {
        refresh_token: refreshToken,
      });

      // 새로운 토큰 저장
      if (response.data && response.data.access_token) {
        tokenManager.setAccessToken(response.data.access_token);
        if (response.data.refresh_token) {
          tokenManager.setRefreshToken(response.data.refresh_token);
        }
      }

      return response;
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      // 토큰 갱신 실패 시 로그아웃
      tokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * 로그아웃
   * @returns {Promise<Object>} 로그아웃 응답
   */
  async logout() {
    try {
      const tokens = tokenManager.getTokens();

      // 토큰이 있으면 서버에 로그아웃 요청
      if (tokens.access_token && tokens.refresh_token) {
        const logoutData = {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        };

        const response = await this.post('/logout', logoutData);

        // 로컬 토큰 삭제
        tokenManager.clearTokens();

        return response;
      }

      // 로컬 토큰 삭제
      tokenManager.clearTokens();
      return { message: '로그아웃되었습니다.' };
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 에러가 발생해도 로컬 토큰은 삭제
      tokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * 사용자 프로필 조회
   * @returns {Promise<Object>} 사용자 프로필
   */
  async getUserProfile() {
    try {
      return await this.get('/user/profile');
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 사용자 프로필 업데이트
   * @param {Object} profileData - 프로필 데이터
   * @returns {Promise<Object>} 업데이트 응답
   */
  async updateUserProfile(profileData) {
    try {
      return await this.put('/user/profile', profileData);
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      throw error;
    }
  }

  /**
   * 사용자 정보를 조회합니다.
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object>} 사용자 정보
   */
  async getUserInfo(userId) {
    return this.get(`/user/${userId}`);
  }

  /**
   * 운동계획 조회
   * @param {number} userId - 사용자 ID
   * @param {number} year - 년도 (선택사항)
   * @param {number} month - 월 (선택사항)
   * @returns {Promise<Object>} 운동계획 조회 응답
   */
  async getWorkoutPlan(userId, year = null, month = null) {
    try {
      let endpoint = `/workout/${userId}`;

      // 년도와 월이 제공되면 쿼리 파라미터 추가
      if (year && month) {
        endpoint += `?year=${year}&month=${month}`;
      }

      return await this.get(endpoint);
    } catch (error) {
      console.error('운동계획 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 운동계획 저장 (달력 데이터를 모두 새로 저장)
   * @param {number} userId - 사용자 ID
   * @param {Object} calendarWorkouts - 달력의 모든 운동 데이터
   * @param {number} year - 년도
   * @param {number} month - 월
   * @returns {Promise<Object>} 운동계획 저장 응답
   */
  async saveWorkoutPlan(userId, calendarWorkouts, year, month) {
    try {
      console.log(`운동계획 저장 시작: 사용자 ${userId}, ${year}년 ${month}월`);

      // 달력 데이터를 API 형식으로 변환
      const dailyWorkouts = [];

      Object.entries(calendarWorkouts).forEach(([dateKey, workouts]) => {
        if (workouts && workouts.length > 0) {
          // dateKey는 "2024-12-15" 형식이므로 날짜 부분만 추출
          const dayNumber = parseInt(dateKey.split('-')[2]);

          const workoutNames = workouts
            .map(workout => workout.name)
            .filter(name => name && name.trim() !== '');

          if (workoutNames.length > 0) {
            dailyWorkouts.push({
              day: dayNumber,
              workout_names: workoutNames,
            });
          }
        }
      });

      const workoutPlanData = {
        daily_workouts: dailyWorkouts,
        year: year,
        month: month,
      };

      console.log('저장할 운동 데이터:', workoutPlanData);

      // 운동계획 데이터를 한 번에 저장
      const response = await this.post(`/workout/${userId}`, workoutPlanData);
      console.log('운동 데이터 저장 완료');
      return response;
    } catch (error) {
      console.error('운동계획 저장 오류:', error);
      throw error;
    }
  }

  /**
   * 식단 조회
   * @param {number} userId - 사용자 ID
   * @param {number} year - 년도
   * @param {number} month - 월
   * @returns {Promise<Object>} 식단 조회 응답
   */
  async getDiet(userId, year, month) {
    try {
      const endpoint = `/diet/${userId}?year=${year}&month=${month}`;
      return await this.get(endpoint);
    } catch (error) {
      console.error('식단 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 식단 저장
   * @param {number} userId - 사용자 ID
   * @param {Object} calendarMeals - 달력의 모든 식단 데이터
   * @param {number} year - 년도
   * @param {number} month - 월
   * @returns {Promise<Object>} 식단 저장 응답
   */
  async saveDiet(userId, calendarMeals, year, month) {
    try {
      console.log(`식단 저장 시작: 사용자 ${userId}, ${year}년 ${month}월`);

      // 달력 데이터를 API 형식으로 변환
      const dailyDiets = [];

      Object.entries(calendarMeals).forEach(([dateKey, dayMeals]) => {
        if (dayMeals && Object.keys(dayMeals).length > 0) {
          // dateKey는 "2024-12-15" 형식이므로 날짜 부분만 추출
          const dayNumber = parseInt(dateKey.split('-')[2]);

          const meals = [];

          // 각 식사 타입별로 음식 정보 수집
          Object.entries(dayMeals).forEach(([mealType, foods]) => {
            if (foods && Array.isArray(foods) && foods.length > 0) {
              foods.forEach(food => {
                if (food.name && food.name.trim() !== '') {
                  // 칼로리 정보 추출 (예: "350kcal" -> 350)
                  const caloriesMatch = food.calories
                    ? food.calories.match(/(\d+)/)
                    : null;
                  const calories = caloriesMatch
                    ? parseFloat(caloriesMatch[1])
                    : 0;

                  meals.push({
                    meal_type: mealType,
                    food_name: food.name,
                    calories: calories,
                  });
                }
              });
            }
          });

          if (meals.length > 0) {
            dailyDiets.push({
              day: dayNumber,
              meals: meals,
            });
          }
        }
      });

      const dietData = {
        daily_diets: dailyDiets,
        year: year,
        month: month,
      };

      console.log('저장할 식단 데이터:', dietData);

      // 식단 데이터를 한 번에 저장
      const response = await this.post(`/diet/${userId}`, dietData);
      console.log('식단 데이터 저장 완료');
      return response;
    } catch (error) {
      console.error('식단 저장 오류:', error);
      throw error;
    }
  }

  /**
   * 운동 프로그램 조회
   * @param {string} categorySmall - 소분류 (category_small)
   * @returns {Promise<Object>} 운동 프로그램 목록 조회 응답
   */
  async getWorkoutProgram(categorySmall) {
    try {
      if (!categorySmall) {
        throw new Error('category_small 파라미터는 필수입니다.');
      }

      // URL 인코딩하여 쿼리 파라미터 추가
      const encodedCategory = encodeURIComponent(categorySmall);
      const endpoint = `/workout-program?category_small=${encodedCategory}`;

      return await this.get(endpoint);
    } catch (error) {
      console.error('운동 프로그램 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 사용자 기반 AI 처방 추천
   * @param {number} userSeq - 사용자 시퀀스 (user_seq)
   * @param {number} topK - 상위 추천 개수 (1-10, 기본값: 3)
   * @returns {Promise<Object>} AI 처방 추천 응답
   */
  async getPrescriptionRecommend(userSeq, topK = 3) {
    try {
      if (!userSeq) {
        throw new Error('user_seq 파라미터는 필수입니다.');
      }

      if (topK < 1 || topK > 10) {
        throw new Error('top_k는 1과 10 사이의 값이어야 합니다.');
      }

      const endpoint = `/prescription/recommend/${userSeq}?top_k=${topK}`;
      return await this.get(endpoint);
    } catch (error) {
      console.error('AI 처방 추천 오류:', error);
      throw error;
    }
  }

  /**
   * API 연결 상태 확인
   * @returns {Promise<boolean>} 연결 상태
   */
  async checkConnection() {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      console.error('API 연결 확인 오류:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성
const apiService = new ApiService();

export default apiService;
