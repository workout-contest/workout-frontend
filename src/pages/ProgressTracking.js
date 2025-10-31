import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiService from '../services/apiService';
import tokenManager from '../utils/tokenManager';

const PlanContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Header = styled.div`
  background: var(--primary-gradient);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1rem;
  opacity: 0.9;
`;

const AnalysisSection = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const AnalysisTitle = styled.h3`
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const StatCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  text-align: center;
  border-left: 4px solid ${props => props.borderColor || 'var(--primary-color)'};
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
`;

const StatValue = styled.div`
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-family: var(--font-primary);
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const TopWorkoutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
`;

const TopWorkoutCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-gradient);
  }
`;

const TopWorkoutIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
`;

const TopWorkoutName = styled.div`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const TopWorkoutCount = styled.div`
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
`;

const TopWorkoutDays = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const ProgressTracking = () => {
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 운동 통계 함수들
  const getWorkoutStats = () => {
    const stats = {
      totalWorkouts: 0,
      totalDays: 0,
      avgWorkoutsPerDay: 0,
      mostActiveDay: 0,
    };

    const dayCounts = {};
    let totalDays = 0;

    Object.values(workoutPlan).forEach(workouts => {
      if (workouts && workouts.length > 0) {
        totalDays++;
        const count = workouts.length;
        stats.totalWorkouts += count;
        dayCounts[count] = (dayCounts[count] || 0) + 1;
      }
    });

    stats.totalDays = totalDays;
    stats.avgWorkoutsPerDay =
      totalDays > 0 ? (stats.totalWorkouts / totalDays).toFixed(1) : 0;
    stats.mostActiveDay = Math.max(...Object.keys(dayCounts).map(Number), 0);

    return [
      {
        name: '총 운동 계획',
        value: stats.totalWorkouts,
        icon: '💪',
        color: '#667eea',
      },
      {
        name: '운동한 날',
        value: stats.totalDays,
        icon: '📅',
        color: '#f093fb',
      },
      {
        name: '일 평균 운동',
        value: stats.avgWorkoutsPerDay,
        icon: '📊',
        color: '#4facfe',
      },
      {
        name: '최대 운동 수',
        value: stats.mostActiveDay,
        icon: '🔥',
        color: '#fa709a',
      },
    ];
  };

  const getTopWorkouts = () => {
    const workoutCounts = {};

    Object.values(workoutPlan).forEach(workouts => {
      if (workouts && Array.isArray(workouts)) {
        workouts.forEach(workoutName => {
          workoutCounts[workoutName] = (workoutCounts[workoutName] || 0) + 1;
        });
      }
    });

    return Object.entries(workoutCounts)
      .map(([name, count]) => ({
        name,
        count,
        icon: getWorkoutIcon(name),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getWorkoutIcon = workoutName => {
    const iconMap = {
      걷기: '🚶',
      조깅: '🏃',
      러닝: '🏃‍♂️',
      자전거: '🚴',
      수영: '🏊',
      요가: '🧘',
      필라테스: '🤸',
      스쿼트: '💪',
      팔굽혀펴기: '💪',
      플랭크: '🤸‍♂️',
      스트레칭: '🤸‍♀️',
      유산소: '⚡',
      근력운동: '🏋️',
      헬스: '🏋️‍♂️',
    };

    // 운동 이름에 포함된 키워드로 매칭
    for (const [key, icon] of Object.entries(iconMap)) {
      if (workoutName.includes(key)) {
        return icon;
      }
    }

    return '💪';
  };

  // 운동 계획 데이터 로드
  const loadWorkoutData = async () => {
    if (!tokenManager.isLoggedIn()) return;

    setIsLoadingData(true);
    try {
      const userId = tokenManager.getUserId();
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await apiService.getWorkoutPlan(userId, year, month);
      if (response && response.status === 200 && response.data) {
        const plan = {};
        // API 응답: 각 운동이 개별 레코드로 반환됨 (workout_name 필드 사용)
        response.data.forEach(item => {
          const dateKey = `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
          if (!plan[dateKey]) {
            plan[dateKey] = [];
          }
          if (item.workout_name) {
            plan[dateKey].push(item.workout_name);
          }
        });
        setWorkoutPlan(plan);
      }
    } catch (error) {
      console.error('운동 계획 데이터 로드 오류:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadWorkoutData();
  }, []);

  return (
    <PlanContainer>
      <Header>
        <Title>📈 진행 상황 추적</Title>
        <Subtitle>
          운동 계획 수립에서 저장한 운동 데이터를 기반으로 통계를 확인할 수
          있습니다. 총 운동 수, 운동한 날, 일 평균 운동 수, 자주 하는 운동 TOP 5
          등을 분석해드립니다.
        </Subtitle>
      </Header>

      <AnalysisSection>
        <AnalysisTitle>📊 이번 달 운동 분석</AnalysisTitle>
        <StatsGrid>
          {getWorkoutStats().map((stat, index) => (
            <StatCard key={index} borderColor={stat.color}>
              <StatIcon>{stat.icon}</StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.name}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <AnalysisTitle>💪 자주 하는 운동 TOP 5</AnalysisTitle>
        <TopWorkoutsGrid>
          {getTopWorkouts().length > 0 ? (
            getTopWorkouts().map((workout, index) => (
              <TopWorkoutCard key={index}>
                <TopWorkoutIcon>{workout.icon}</TopWorkoutIcon>
                <TopWorkoutName>{workout.name}</TopWorkoutName>
                <TopWorkoutCount>{workout.count}회</TopWorkoutCount>
              </TopWorkoutCard>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                padding: 'var(--spacing-xl)',
                gridColumn: '1 / -1',
              }}
            >
              아직 운동 계획 데이터가 없습니다.
            </div>
          )}
        </TopWorkoutsGrid>
      </AnalysisSection>
    </PlanContainer>
  );
};

export default ProgressTracking;
