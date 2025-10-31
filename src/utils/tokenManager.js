/**
 * 토큰 관리 유틸리티
 * JWT 토큰의 저장, 조회, 삭제를 담당합니다.
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
};

class TokenManager {
  /**
   * 액세스 토큰 저장
   * @param {string} token - JWT 액세스 토큰
   */
  setAccessToken(token) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * 리프레시 토큰 저장
   * @param {string} token - JWT 리프레시 토큰
   */
  setRefreshToken(token) {
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * 사용자 ID 저장
   * @param {number} userId - 사용자 ID
   */
  setUserId(userId) {
    localStorage.setItem(TOKEN_KEYS.USER_ID, userId.toString());
  }

  /**
   * 액세스 토큰 조회
   * @returns {string|null} 액세스 토큰 또는 null
   */
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  }

  /**
   * 리프레시 토큰 조회
   * @returns {string|null} 리프레시 토큰 또는 null
   */
  getRefreshToken() {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * 사용자 ID 조회
   * @returns {number|null} 사용자 ID 또는 null
   */
  getUserId() {
    const userId = localStorage.getItem(TOKEN_KEYS.USER_ID);
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * 모든 토큰 정보 저장
   * @param {Object} tokenData - 토큰 데이터
   * @param {string} tokenData.access_token - 액세스 토큰
   * @param {string} tokenData.refresh_token - 리프레시 토큰
   * @param {number} tokenData.user_id - 사용자 ID
   */
  setTokens(tokenData) {
    this.setAccessToken(tokenData.access_token);
    this.setRefreshToken(tokenData.refresh_token);
    this.setUserId(tokenData.user_id);
  }

  /**
   * 모든 토큰 정보 조회
   * @returns {Object} 토큰 정보 객체
   */
  getTokens() {
    return {
      access_token: this.getAccessToken(),
      refresh_token: this.getRefreshToken(),
      user_id: this.getUserId(),
    };
  }

  /**
   * 로그인 상태 확인
   * @returns {boolean} 로그인 여부
   */
  isLoggedIn() {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    try {
      // JWT 토큰 디코딩하여 만료 시간 확인
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      return false;
    }
  }

  /**
   * 토큰 만료 시간 확인
   * @param {string} token - JWT 토큰
   * @returns {number|null} 만료 시간 (Unix timestamp) 또는 null
   */
  getTokenExpiration(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp;
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      return null;
    }
  }

  /**
   * 토큰 만료까지 남은 시간 (초)
   * @param {string} token - JWT 토큰
   * @returns {number|null} 남은 시간 (초) 또는 null
   */
  getTokenTimeRemaining(token) {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return null;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, expiration - currentTime);
  }

  /**
   * 모든 토큰 삭제 (로그아웃)
   */
  clearTokens() {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER_ID);
  }

  /**
   * 토큰 정보 디버깅용 출력
   */
  debugTokens() {
    const tokens = this.getTokens();
    console.log('=== 토큰 정보 ===');
    console.log('사용자 ID:', tokens.user_id);
    console.log('액세스 토큰:', tokens.access_token);
    console.log('리프레시 토큰:', tokens.refresh_token);
    console.log('로그인 상태:', this.isLoggedIn());

    if (tokens.access_token) {
      const timeRemaining = this.getTokenTimeRemaining(tokens.access_token);
      console.log('토큰 만료까지 남은 시간:', timeRemaining, '초');
    }
  }
}

// 싱글톤 인스턴스 생성
const tokenManager = new TokenManager();

export default tokenManager;
