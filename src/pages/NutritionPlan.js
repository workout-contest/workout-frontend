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

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
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

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
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

const TopFoodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`;

const TopFoodCard = styled.div`
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

const TopFoodIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
`;

const TopFoodName = styled.div`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const TopFoodCalories = styled.div`
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
`;

const TopFoodCount = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const WorkoutPlan = () => {
  const [calendarMeals, setCalendarMeals] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 영양분석 함수들
  const getMealTypeStats = () => {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const mealTypeNames = {
      breakfast: { name: '아침', icon: '🌅', color: '#FFB347' },
      lunch: { name: '점심', icon: '☀️', color: '#FF6B6B' },
      dinner: { name: '저녁', icon: '🌙', color: '#4ECDC4' },
      snack: { name: '간식', icon: '🍪', color: '#45B7D1' },
    };

    return mealTypes.map(type => {
      const meals = Object.values(calendarMeals).flatMap(dayMeals =>
        dayMeals && dayMeals[type] ? dayMeals[type] : []
      );
      const totalCalories = meals.reduce((sum, meal) => {
        const caloriesMatch = meal.calories
          ? meal.calories.match(/(\d+)/)
          : null;
        return sum + (caloriesMatch ? parseFloat(caloriesMatch[1]) : 0);
      }, 0);
      const mealCount = meals.length;

      return {
        type,
        ...mealTypeNames[type],
        calories: totalCalories,
        count: mealCount,
      };
    });
  };

  const getTopFoods = () => {
    const foodCounts = {};
    const foodCalories = {};

    Object.values(calendarMeals).forEach(dayMeals => {
      if (dayMeals) {
        Object.values(dayMeals).forEach(meals => {
          if (meals && Array.isArray(meals)) {
            meals.forEach(meal => {
              foodCounts[meal.name] = (foodCounts[meal.name] || 0) + 1;

              const caloriesMatch = meal.calories
                ? meal.calories.match(/(\d+)/)
                : null;
              const calories = caloriesMatch ? parseFloat(caloriesMatch[1]) : 0;
              foodCalories[meal.name] =
                (foodCalories[meal.name] || 0) + calories;
            });
          }
        });
      }
    });

    return Object.entries(foodCounts)
      .map(([name, count]) => ({
        name,
        count,
        calories: foodCalories[name] || 0,
        icon: getFoodIcon(name),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getFoodIcon = foodName => {
    const iconMap = {
      우유: '🥛',
      요거트: '🥛',
      토스트: '🍞',
      오트밀: '🌾',
      바나나: '🍌',
      닭가슴살: '🍗',
      연어: '🐟',
      계란: '🥚',
      브로콜리: '🥦',
      고구마: '🍠',
      퀴노아: '🌾',
      아보카도: '🥑',
      견과류: '🥜',
      시금치: '🥬',
    };
    return iconMap[foodName] || '🍽️';
  };

  // 식단 데이터 로드
  const loadNutritionData = async () => {
    if (!tokenManager.isLoggedIn()) return;

    setIsLoadingData(true);
    try {
      const userId = tokenManager.getUserId();
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await apiService.getDiet(userId, year, month);
      if (response && response.data) {
        const meals = {};
        response.data.forEach(item => {
          const dateKey = `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
          if (!meals[dateKey]) {
            meals[dateKey] = {};
          }
          if (!meals[dateKey][item.meal_type]) {
            meals[dateKey][item.meal_type] = [];
          }
          meals[dateKey][item.meal_type].push({
            name: item.food_name,
            calories: `${item.calories}kcal`,
            icon: '🍽️',
          });
        });
        setCalendarMeals(meals);
      }
    } catch (error) {
      console.error('식단 데이터 로드 오류:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadNutritionData();
  }, []);

  return (
    <PlanContainer>
      <Header>
        <Title>📊 영양 분석</Title>
        <Subtitle>
          영양 가이드에서 저장한 식단 데이터를 기반으로 통계를 확인할 수
          있습니다. 식사 타입별 칼로리, 자주 먹는 음식 TOP 5 등을 분석하여 영양
          섭취 현황을 파악하세요.
        </Subtitle>
      </Header>

      <AnalysisSection>
        <AnalysisTitle>📊 이번 달 영양 분석</AnalysisTitle>
        <StatsGrid>
          {getMealTypeStats().map(mealType => (
            <StatCard key={mealType.type} borderColor={mealType.color}>
              <StatIcon>{mealType.icon}</StatIcon>
              <StatValue>{mealType.calories}kcal</StatValue>
              <StatLabel>
                {mealType.name} ({mealType.count}회)
              </StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <AnalysisTitle>🍎 자주 먹는 음식 TOP 5</AnalysisTitle>
        <TopFoodsGrid>
          {getTopFoods().length > 0 ? (
            getTopFoods().map((food, index) => (
              <TopFoodCard key={index}>
                <TopFoodIcon>{food.icon}</TopFoodIcon>
                <TopFoodName>{food.name}</TopFoodName>
                <TopFoodCalories>{food.calories} kcal</TopFoodCalories>
                <TopFoodCount>{food.count}회 섭취</TopFoodCount>
              </TopFoodCard>
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
              아직 식단 데이터가 없습니다.
            </div>
          )}
        </TopFoodsGrid>
      </AnalysisSection>
    </PlanContainer>
  );
};

export default WorkoutPlan;
