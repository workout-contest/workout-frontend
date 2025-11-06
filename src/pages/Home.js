import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import storageManager from '../utils/storageManager';
import apiService from '../services/apiService';
import tokenManager from '../utils/tokenManager';

const ServiceContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const WelcomeSection = styled.div`
  background: var(--primary-gradient);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: var(--spacing-lg);
  }
`;

const WelcomeTitle = styled.h1`
  font-family: var(--font-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-lg);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const HealthStatusCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  @media (max-width: 768px) {
    font-size: 1.2rem;
    flex-wrap: wrap;
  }
`;

const BMICard = styled.div`
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const BMIValue = styled.div`
  font-family: var(--font-secondary);
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const BMICategory = styled.div`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

const BMIStatus = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const ServiceCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CardTitle = styled.h3`
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CardDescription = styled.p`
  font-family: var(--font-primary);
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  flex-grow: 1;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.5;
  }
`;

const ActionButton = styled.button`
  font-family: var(--font-primary);
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 44px; /* 터치 영역 확보 */

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: var(--spacing-md) var(--spacing-lg);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--spacing-md);

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
    align-items: flex-start;
    padding-top: 10vh;
  }
`;

const ModalContent = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: auto;
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
    max-width: 100%;
    max-height: 85vh;
    border-radius: var(--radius-lg);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`;

const ModalTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  min-width: 32px;
  min-height: 32px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Home = ({ userInfo: propUserInfo }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(propUserInfo || {});
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    if (propUserInfo) {
      setUserInfo(propUserInfo);
    } else {
      const savedUserInfo = storageManager.getUserInfo();
      if (savedUserInfo) {
        setUserInfo(savedUserInfo);
      }
    }
  }, [propUserInfo]);

  const getBMIAdvice = bmi => {
    if (bmi < 18.5)
      return '체중 증가를 위한 근력 운동과 충분한 영양 섭취를 권장합니다.';
    if (bmi < 23) return '현재 건강한 상태입니다. 유지 운동을 계속하세요!';
    if (bmi < 25) return '체중 관리와 유산소 운동을 통해 건강을 유지하세요.';
    if (bmi < 30)
      return '규칙적인 운동과 식단 관리로 건강한 체중을 목표로 하세요.';
    return '전문가와 상담하여 체계적인 운동 계획을 세우는 것을 권장합니다.';
  };

  const handleGetRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const userId = tokenManager.getUserId();

      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await apiService.getPrescriptionRecommend(userId, 3);

      if (response.status === 200 && response.data) {
        setRecommendations(response.data);
        setShowRecommendations(true);
      } else {
        alert('추천 운동을 가져오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('추천 운동 가져오기 오류:', error);
      alert('추천 운동을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  return (
    <ServiceContainer>
      {userInfo.name ? (
        <>
          {/* 환영 섹션 */}
          <WelcomeSection>
            <WelcomeTitle>안녕하세요, {userInfo.name}님! 👋</WelcomeTitle>
            <WelcomeSubtitle>오늘도 건강한 하루를 시작해보세요</WelcomeSubtitle>
          </WelcomeSection>

          {/* 건강 상태 섹션 */}
          <HealthStatusCard>
            <SectionTitle>📊 나의 건강 상태</SectionTitle>
            <BMICard>
              <BMIValue>BMI {userInfo.bmi}</BMIValue>
              <BMICategory>{userInfo.bmiCategory}</BMICategory>
              <BMIStatus>
                BMI(Body Mass Index)는 체중과 키를 기반으로 계산한
                체질량지수입니다.
                <br />
                {getBMIAdvice(userInfo.bmi)}
              </BMIStatus>
            </BMICard>
          </HealthStatusCard>

          {/* 서비스 카드 그리드 */}
          <GridContainer>
            <ServiceCard>
              <CardIcon>🤖</CardIcon>
              <CardTitle>오늘의 AI 추천</CardTitle>
              <CardDescription>
                당신의 키와 몸무게 정보를 기반으로 AI가 개인 맞춤형 운동을
                추천합니다. 국민체력100 체력인증센터 데이터를 활용한 과학적인
                운동 처방을 받아보세요.
              </CardDescription>
              <ActionButton onClick={() => setShowAIRecommendation(true)}>
                AI 추천 받기
              </ActionButton>
            </ServiceCard>

            <ServiceCard>
              <CardIcon>🎥</CardIcon>
              <CardTitle>맞춤 동영상 추천</CardTitle>
              <CardDescription>
                운동 카테고리별로 운동 동영상을 검색하고 시청할 수 있습니다.
                집콕운동, 다이어트 댄스, 근력운동, 심폐지구력 등 다양한
                카테고리에서 원하는 운동 영상을 찾아보세요.
              </CardDescription>
              <ActionButton onClick={() => navigate('/videos')}>
                동영상 보기
              </ActionButton>
            </ServiceCard>

            <ServiceCard>
              <CardIcon>📋</CardIcon>
              <CardTitle>운동 계획 수립</CardTitle>
              <CardDescription>
                달력 형태로 월별 운동 계획을 세워보세요. 운동 팔레트에서 운동을
                선택하여 원하는 날짜에 드래그 앤 드롭으로 배치하고 저장할 수
                있습니다.
              </CardDescription>
              <ActionButton onClick={() => navigate('/plan')}>
                계획 만들기
              </ActionButton>
            </ServiceCard>

            <ServiceCard>
              <CardIcon>📈</CardIcon>
              <CardTitle>진행 상황 추적</CardTitle>
              <CardDescription>
                운동 계획 수립에서 저장한 운동 데이터를 기반으로 통계를 확인할
                수 있습니다. 총 운동 수, 운동한 날, 일 평균 운동 수, 자주 하는
                운동 TOP 5 등을 분석해드립니다.
              </CardDescription>
              <ActionButton onClick={() => navigate('/progress')}>
                통계 보기
              </ActionButton>
            </ServiceCard>

            <ServiceCard>
              <CardIcon>🍎</CardIcon>
              <CardTitle>영양 가이드</CardTitle>
              <CardDescription>
                달력 형태로 월별 식단 계획을 세워보세요. 음식 팔레트에서 음식을
                선택하여 아침, 점심, 저녁, 간식별로 원하는 날짜에 드래그 앤
                드롭으로 배치하고 칼로리 정보와 함께 저장할 수 있습니다.
              </CardDescription>
              <ActionButton onClick={() => navigate('/nutrition')}>
                식단 가이드
              </ActionButton>
            </ServiceCard>

            <ServiceCard>
              <CardIcon>🏆</CardIcon>
              <CardTitle>영양 분석</CardTitle>
              <CardDescription>
                영양 가이드에서 저장한 식단 데이터를 기반으로 통계를 확인할 수
                있습니다. 식사 타입별 칼로리, 자주 먹는 음식 TOP 5 등을 분석하여
                영양 섭취 현황을 파악할 수 있습니다.
              </CardDescription>
              <ActionButton onClick={() => navigate('/achievements')}>
                영양 분석
              </ActionButton>
            </ServiceCard>
          </GridContainer>

          {/* AI 추천 모달 */}
          {showAIRecommendation && (
            <ModalOverlay onClick={() => setShowAIRecommendation(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>🤖 오늘의 AI 추천</ModalTitle>
                  <ModalCloseButton
                    onClick={() => setShowAIRecommendation(false)}
                  >
                    ×
                  </ModalCloseButton>
                </ModalHeader>

                {/* 오늘의 추천 운동 */}
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-xl)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--spacing-md)',
                      lineHeight: '1.6',
                    }}
                  >
                    당신의 키와 몸무게 정보를 기반으로 AI가 개인 맞춤형 운동을
                    추천합니다.
                    <br />
                    지금 바로 시작해서 건강한 하루를 만들어보세요!
                  </div>

                  {/* AI 추천 근거 */}
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      marginBottom: 'var(--spacing-lg)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      lineHeight: '1.6',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                      🤖 <strong>AI 추천 근거</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      이 추천은 서울올림픽기념국민체육진흥공단의{' '}
                      <strong>국민체력100 체력인증센터 측정결과</strong>{' '}
                      데이터를 기반으로 생성되었습니다. 연령별·항목별 체력 측정
                      데이터를 분석하여 개인 맞춤형 운동처방을 제공합니다.
                    </div>
                  </div>

                  <button
                    style={{
                      background: 'var(--primary-gradient)',
                      color: 'white',
                      border: 'none',
                      padding: 'var(--spacing-md) var(--spacing-xl)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-primary)',
                    }}
                    onMouseOver={e => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseOut={e => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onClick={handleGetRecommendations}
                    disabled={loadingRecommendations}
                  >
                    {loadingRecommendations
                      ? '추천 중...'
                      : '추천 운동 시작하기'}
                  </button>
                </div>
              </ModalContent>
            </ModalOverlay>
          )}

          {/* 추천 운동 결과 모달 */}
          {showRecommendations && (
            <ModalOverlay onClick={() => setShowRecommendations(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>🤖 AI 추천 운동</ModalTitle>
                  <ModalCloseButton
                    onClick={() => setShowRecommendations(false)}
                  >
                    ×
                  </ModalCloseButton>
                </ModalHeader>

                <div
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-lg)',
                    textAlign: 'center',
                  }}
                >
                  당신에게 맞는 운동을 추천해드립니다
                </div>

                {recommendations.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-md)',
                    }}
                  >
                    {recommendations.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--spacing-lg)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-sm)',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'var(--font-primary)',
                              fontSize: '1.2rem',
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {index + 1}. {item.pres_note}
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-primary)',
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'var(--primary-color)',
                            }}
                          >
                            {(item.prob * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '8px',
                            background: 'var(--bg-primary)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${(item.prob * 100).toFixed(2)}%`,
                              height: '100%',
                              background: 'var(--primary-gradient)',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 'var(--spacing-xl)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    추천 운동이 없습니다.
                  </div>
                )}

                <button
                  onClick={() => setShowRecommendations(false)}
                  style={{
                    width: '100%',
                    marginTop: 'var(--spacing-lg)',
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-primary)',
                  }}
                  onMouseOver={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseOut={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  닫기
                </button>
              </ModalContent>
            </ModalOverlay>
          )}
        </>
      ) : (
        <>
          {/* 초기 화면 */}
          <WelcomeSection>
            <WelcomeTitle>스텝포워드에 오신 것을 환영합니다! 🏃‍♂️</WelcomeTitle>
            <WelcomeSubtitle>
              회원가입을 통해 AI 기반 맞춤형 건강 관리를 시작해보세요
            </WelcomeSubtitle>
          </WelcomeSection>

          <HealthStatusCard>
            <SectionTitle>🎯 서비스 소개</SectionTitle>
            <BMICard>
              <BMIStatus>
                • AI 기반 맞춤형 운동 추천
                <br />
                • 운동 카테고리별 동영상 검색 및 시청
                <br />
                • 월별 운동 계획 수립 및 저장
                <br />
                • 운동 데이터 기반 통계 분석
                <br />
                • 월별 식단 계획 수립 및 저장
                <br />• 식단 데이터 기반 영양 분석
              </BMIStatus>
            </BMICard>
          </HealthStatusCard>
        </>
      )}
    </ServiceContainer>
  );
};

export default Home;
