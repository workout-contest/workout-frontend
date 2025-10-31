import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import tokenManager from './utils/tokenManager';
import apiService from './services/apiService';
import storageManager from './utils/storageManager';

// Pages
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import VideoRecommendations from './pages/VideoRecommendations';
import WorkoutPlan from './pages/WorkoutPlan';
import ProgressTracking from './pages/ProgressTracking';
import NutritionGuide from './pages/Nutrition';
import NutritionAnalysis from './pages/NutritionPlan';
import Workout from './pages/Workout';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserInfo = async () => {
    try {
      // 토큰이 있는지 확인
      if (tokenManager.isLoggedIn()) {
        const userId = tokenManager.getUserId();
        if (userId) {
          // API에서 사용자 정보 가져오기
          const response = await apiService.getUserInfo(userId);
          setUserInfo(response.data);

          // 로컬 스토리지에도 저장 (기존 기능과 호환)
          storageManager.saveUserInfo(response.data);
        }
      } else {
        // 로그인하지 않은 경우 사용자 정보 초기화
        setUserInfo(null);
      }
    } catch (error) {
      console.error('사용자 정보 로딩 오류:', error);
      // 에러 발생 시 토큰 삭제 및 사용자 정보 초기화
      tokenManager.clearTokens();
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleLoginStateChange = isLoggedIn => {
    if (isLoggedIn) {
      // 로그인 시 사용자 정보 로드
      loadUserInfo();
    } else {
      // 로그아웃 시 사용자 정보 초기화
      setUserInfo(null);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: 'var(--text-primary)',
        }}
      >
        로딩 중...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {!userInfo ? (
          <Onboarding onComplete={loadUserInfo} />
        ) : (
          <>
            <Header onLoginStateChange={handleLoginStateChange} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home userInfo={userInfo} />} />
                <Route path="/videos" element={<VideoRecommendations />} />
                <Route path="/plan" element={<WorkoutPlan />} />
                <Route path="/progress" element={<ProgressTracking />} />
                <Route path="/nutrition" element={<NutritionGuide />} />
                <Route
                  path="/nutrition-analysis"
                  element={<NutritionAnalysis />}
                />
                <Route path="/achievements" element={<NutritionAnalysis />} />
                <Route path="/workout" element={<Workout />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
