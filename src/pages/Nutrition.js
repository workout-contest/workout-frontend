import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import storageManager from '../utils/storageManager';
import apiService from '../services/apiService';
import tokenManager from '../utils/tokenManager';

const NutritionContainer = styled.div`
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

const NutritionSection = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: var(--spacing-lg);
  min-height: 80vh;
  max-width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 350px 1fr;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
`;

const CalendarContainer = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const MonthYear = styled.h2`
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CalendarNav = styled.button`
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 40px;
  min-width: 60px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: var(--spacing-xs) var(--spacing-sm);
    min-height: 44px;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    gap: var(--spacing-xs);
  }
`;

const DayHeader = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  padding: var(--spacing-sm);
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: var(--spacing-xs);
  }
`;

const CalendarDay = styled.div`
  min-height: 160px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.9) 100%
  );
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    min-height: 100px;
    padding: var(--spacing-xs);
  }

  &:hover {
    border-color: #667eea;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.1) 0%,
      rgba(118, 75, 162, 0.1) 100%
    );
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
  }

  &.today {
    border-color: #10b981;
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.15) 0%,
      rgba(5, 150, 105, 0.15) 100%
    );
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }

  &.has-meal {
    border-color: #667eea;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.15) 0%,
      rgba(118, 75, 162, 0.15) 100%
    );
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  &.other-month {
    opacity: 0.4;
    cursor: not-allowed;
    background: rgba(248, 250, 252, 0.5);
  }
`;

const DayNumber = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`;

const MealItem = styled.div`
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  min-height: 28px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 2px var(--spacing-xs);
    min-height: 24px;
  }

  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 3px 8px rgba(59, 130, 246, 0.4);
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    opacity: 0.8;
    transform: rotate(2deg) scale(1.05);
    z-index: 1000;
  }
`;

const MealIcon = styled.span`
  margin-right: var(--spacing-xs);
`;

const RemoveMealButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: var(--radius-xs);
  padding: 2px 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const FoodPalette = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-light);
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const PaletteTitle = styled.h3`
  font-family: var(--font-primary);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
`;

const MealTypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
`;

const MealTypeButton = styled.button`
  background: ${props =>
    props.active ? 'var(--primary-gradient)' : 'var(--bg-tertiary)'};
  color: ${props => (props.active ? 'white' : 'var(--text-primary)')};
  border: 2px solid
    ${props => (props.active ? 'var(--primary-color)' : 'var(--border-light)')};
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
`;

const FoodGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  height: calc(100% - 200px);
  overflow-y: auto;
  padding-right: var(--spacing-xs);

  /* 깔끔한 스크롤바 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const FoodCard = styled.div`
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: 44px; /* 터치 영역 확보 */

  @media (max-width: 768px) {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  &:hover {
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    background: var(--bg-primary);
    border-color: var(--primary-color);
  }

  &:active {
    cursor: grabbing;
    transform: translateX(2px) scale(1.01);
  }

  &.dragging {
    opacity: 0.7;
    transform: rotate(3deg) scale(1.05);
    z-index: 1000;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--primary-gradient);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
  }
`;

const FoodIcon = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
`;

const FoodName = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const FoodCalories = styled.div`
  font-family: var(--font-primary);
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.2;
  flex: 1;
`;

const DropZone = styled.div`
  min-height: 80px;
  border: 2px dashed var(--border-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &.drag-over {
    border-color: var(--primary-color);
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary-color);
  }
`;

const SaveButton = styled.button`
  background: var(--success-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 50px; /* 터치 영역 확보 */

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: var(--spacing-md);
    min-height: 44px;
  }
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:disabled {
    background: var(--text-light);
    cursor: not-allowed;
    transform: none;
  }
`;

const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SaveSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
`;

// 분석 섹션 스타일
const AnalysisSection = styled.div`
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const AnalysisTitle = styled.h3`
  font-family: var(--font-primary);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const StatCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  text-align: center;
  border: 2px solid ${props => props.borderColor || 'var(--border-light)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
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

const TopFoodsList = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
`;

const FoodItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
`;

const FoodCount = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const NutritionGuide = () => {
  const [userInfo, setUserInfo] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarMeals, setCalendarMeals] = useState({});
  const [draggedFood, setDraggedFood] = useState(null);
  const [draggedMeal, setDraggedMeal] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [foodData, setFoodData] = useState({
    breakfast: [
      { name: '계란', icon: '🥚', calories: '70kcal' },
      { name: '토스트', icon: '🍞', calories: '80kcal' },
      { name: '우유', icon: '🥛', calories: '60kcal' },
      { name: '바나나', icon: '🍌', calories: '90kcal' },
      { name: '요거트', icon: '🥄', calories: '50kcal' },
      { name: '오트밀', icon: '🥣', calories: '100kcal' },
    ],
    lunch: [
      { name: '닭가슴살', icon: '🍗', calories: '120kcal' },
      { name: '현미밥', icon: '🍚', calories: '110kcal' },
      { name: '브로콜리', icon: '🥦', calories: '30kcal' },
      { name: '연어', icon: '🐟', calories: '140kcal' },
      { name: '고구마', icon: '🍠', calories: '80kcal' },
      { name: '시금치', icon: '🥬', calories: '20kcal' },
    ],
    dinner: [
      { name: '연어구이', icon: '🐟', calories: '150kcal' },
      { name: '퀴노아', icon: '🌾', calories: '120kcal' },
      { name: '아보카도', icon: '🥑', calories: '160kcal' },
      { name: '토마토', icon: '🍅', calories: '20kcal' },
      { name: '올리브오일', icon: '🫒', calories: '90kcal' },
      { name: '견과류', icon: '🥜', calories: '180kcal' },
    ],
    snack: [
      { name: '사과', icon: '🍎', calories: '50kcal' },
      { name: '견과류', icon: '🥜', calories: '180kcal' },
      { name: '그릭요거트', icon: '🥄', calories: '60kcal' },
      { name: '다크초콜릿', icon: '🍫', calories: '150kcal' },
      { name: '베리류', icon: '🫐', calories: '40kcal' },
      { name: '프로틴바', icon: '🍫', calories: '200kcal' },
    ],
  });

  useEffect(() => {
    const savedUserInfo = storageManager.getUserInfo();
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }

    // 식단 데이터 로드
    loadDietData();
  }, [currentDate]);

  // 식단 데이터 로드 함수
  const loadDietData = async () => {
    try {
      const userId = tokenManager.getUserId();
      if (!userId) {
        console.log('사용자 ID가 없습니다.');
        return;
      }

      setIsLoadingData(true);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      console.log(`식단 조회: 사용자 ${userId}, ${year}년 ${month}월`);

      const response = await apiService.getDiet(userId, year, month);

      if (response.data && Array.isArray(response.data)) {
        // API 응답 데이터를 달력 형식으로 변환
        const mealData = {};

        response.data.forEach(meal => {
          if (meal.day && meal.food_name && meal.meal_type) {
            const dateKey = formatDateKey(
              new Date(meal.year, meal.month - 1, meal.day)
            );

            // 같은 날짜에 여러 식사가 있을 수 있으므로 객체로 관리
            if (!mealData[dateKey]) {
              mealData[dateKey] = {};
            }

            // 식사 타입별로 배열 관리
            if (!mealData[dateKey][meal.meal_type]) {
              mealData[dateKey][meal.meal_type] = [];
            }

            mealData[dateKey][meal.meal_type].push({
              name: meal.food_name,
              icon: '🍽️', // 기본 아이콘
              calories: `${meal.calories}kcal`,
            });
          }
        });

        setCalendarMeals(mealData);
        console.log('식단 데이터 로드 완료:', mealData);
      } else {
        console.log('식단 데이터가 없습니다.');
        setCalendarMeals({});
      }
    } catch (error) {
      console.error('식단 데이터 로드 오류:', error);
      // 에러가 발생해도 기존 데이터는 유지
    } finally {
      setIsLoadingData(false);
    }
  };

  // 달력 관련 함수들
  const getDaysInMonth = date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = date => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 이전 달의 마지막 날들
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    );
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          prevMonthDays - i
        ),
      });
    }

    // 현재 달의 날들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      });
    }

    // 다음 달의 첫 날들
    const remainingDays = 42 - days.length; // 6주 * 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          i
        ),
      });
    }

    return days;
  };

  const formatDateKey = date => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isToday = date => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = direction => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // 드래그 앤 드롭 함수들
  const handleFoodDragStart = (e, food) => {
    setDraggedFood(food);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMealDragStart = (e, meal, dateKey) => {
    setDraggedMeal({ meal, dateKey });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    const dateKey = formatDateKey(targetDate);

    if (draggedFood) {
      // 음식 팔레트에서 달력으로 드래그
      setCalendarMeals(prev => {
        const newMeals = { ...prev };
        if (!newMeals[dateKey]) {
          newMeals[dateKey] = {};
        }
        if (!newMeals[dateKey][selectedMealType]) {
          newMeals[dateKey][selectedMealType] = [];
        }
        // 중복 체크
        const existingFood = newMeals[dateKey][selectedMealType].find(
          f => f.name === draggedFood.name
        );
        if (!existingFood) {
          newMeals[dateKey][selectedMealType].push(draggedFood);
        }
        return newMeals;
      });
      setDraggedFood(null);
    } else if (draggedMeal) {
      // 달력 내에서 식사 이동
      if (draggedMeal.dateKey !== dateKey) {
        setCalendarMeals(prev => {
          const newMeals = { ...prev };
          // 원래 위치에서 제거 (복잡한 구조이므로 간단히 처리)
          // 새 위치에 추가
          if (!newMeals[dateKey]) {
            newMeals[dateKey] = {};
          }
          // 여기서는 간단히 복사만 처리
          return newMeals;
        });
      }
      setDraggedMeal(null);
    }
  };

  const removeMeal = (dateKey, mealType, foodName) => {
    setCalendarMeals(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [mealType]: prev[dateKey][mealType].filter(f => f.name !== foodName),
      },
    }));
  };

  const handleSavePlan = async () => {
    const totalMeals = Object.values(calendarMeals).reduce(
      (total, dayMeals) => {
        if (!dayMeals) return total;
        return (
          total +
          Object.values(dayMeals).reduce(
            (dayTotal, meals) => dayTotal + (meals ? meals.length : 0),
            0
          )
        );
      },
      0
    );

    if (totalMeals === 0) {
      alert('최소 하나의 식사를 배치해주세요!');
      return;
    }

    try {
      // 사용자 ID 가져오기
      const userId = tokenManager.getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      console.log('달력 식단 데이터:', calendarMeals);
      console.log('사용자 ID:', userId);
      console.log(
        '년월:',
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );

      // API 호출
      const response = await apiService.saveDiet(
        parseInt(userId), // 사용자 ID를 숫자로 변환
        calendarMeals, // 달력의 모든 식단 데이터
        currentDate.getFullYear(), // 년도
        currentDate.getMonth() + 1 // 월
      );

      // 로컬 스토리지에도 저장 (기존 기능 유지)
      const planData = {
        meals: calendarMeals,
        savedAt: new Date().toISOString(),
        totalMeals: totalMeals,
      };
      storageManager.saveNutritionPlan(planData);

      alert(
        `🎉 식단 계획이 저장되었습니다!\n\n총 ${totalMeals}개의 식사가 배치되었습니다.\n균형 잡힌 식단으로 건강한 생활을 시작하세요! 🥗`
      );

      // 저장 후 데이터 다시 로드
      loadDietData();
    } catch (error) {
      console.error('식단계획 저장 오류:', error);
      alert('식단계획 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

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
    Object.values(calendarMeals).forEach(dayMeals => {
      if (dayMeals) {
        Object.values(dayMeals).forEach(meals => {
          if (meals && Array.isArray(meals)) {
            meals.forEach(meal => {
              foodCounts[meal.name] = (foodCounts[meal.name] || 0) + 1;
            });
          }
        });
      }
    });

    return Object.entries(foodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getTotalCalories = () => {
    return Object.values(calendarMeals).reduce((total, dayMeals) => {
      if (!dayMeals) return total;
      return (
        total +
        Object.values(dayMeals).reduce((dayTotal, meals) => {
          if (!meals || !Array.isArray(meals)) return dayTotal;
          return (
            dayTotal +
            meals.reduce((mealTotal, meal) => {
              const caloriesMatch = meal.calories
                ? meal.calories.match(/(\d+)/)
                : null;
              return (
                mealTotal + (caloriesMatch ? parseFloat(caloriesMatch[1]) : 0)
              );
            }, 0)
          );
        }, 0)
      );
    }, 0);
  };

  const getTotalMeals = () => {
    return Object.values(calendarMeals).reduce((total, dayMeals) => {
      if (!dayMeals) return total;
      return (
        total +
        Object.values(dayMeals).reduce((dayTotal, meals) => {
          return dayTotal + (meals ? meals.length : 0);
        }, 0)
      );
    }, 0);
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const mealTypes = [
    { key: 'breakfast', name: '아침', icon: '🌅' },
    { key: 'lunch', name: '점심', icon: '☀️' },
    { key: 'dinner', name: '저녁', icon: '🌙' },
    { key: 'snack', name: '간식', icon: '🍪' },
  ];

  return (
    <NutritionContainer>
      <Header>
        <Title>🥗 영양 가이드</Title>
        <Subtitle>
          음식 팔레트에서 음식을 선택하여 달력의 원하는 날짜와 식사 타입(아침,
          점심, 저녁, 간식)에 드래그 앤 드롭으로 배치하고 칼로리 정보와 함께
          저장하여 월별 식단 계획을 세워보세요
        </Subtitle>
      </Header>

      <NutritionSection>
        <FoodPalette>
          <PaletteTitle>🍽️ 음식 팔레트</PaletteTitle>

          <MealTypeSelector>
            {mealTypes.map(mealType => (
              <MealTypeButton
                key={mealType.key}
                active={selectedMealType === mealType.key}
                onClick={() => setSelectedMealType(mealType.key)}
              >
                {mealType.icon} {mealType.name}
              </MealTypeButton>
            ))}
          </MealTypeSelector>

          <FoodGrid>
            {foodData[selectedMealType].map((food, index) => (
              <FoodCard
                key={index}
                draggable
                onDragStart={e => handleFoodDragStart(e, food)}
              >
                <FoodIcon>{food.icon}</FoodIcon>
                <FoodName>{food.name}</FoodName>
                <FoodCalories>{food.calories}</FoodCalories>
              </FoodCard>
            ))}
          </FoodGrid>
        </FoodPalette>

        <CalendarSection>
          <SectionTitle>📅 달력 식단 계획</SectionTitle>

          <CalendarContainer>
            <CalendarHeader>
              <CalendarNav onClick={() => navigateMonth(-1)}>
                ‹ 이전
              </CalendarNav>
              <MonthYear>
                {currentDate.getFullYear()}년{' '}
                {monthNames[currentDate.getMonth()]}
                {isLoadingData && (
                  <span
                    style={{
                      marginLeft: '10px',
                      fontSize: '0.8rem',
                      color: '#666',
                    }}
                  >
                    로딩 중...
                  </span>
                )}
              </MonthYear>
              <CalendarNav onClick={() => navigateMonth(1)}>다음 ›</CalendarNav>
            </CalendarHeader>

            <CalendarGrid>
              {dayNames.map(day => (
                <DayHeader key={day}>{day}</DayHeader>
              ))}
              {calendarDays.map((dayData, index) => {
                const dateKey = formatDateKey(dayData.date);
                const dayMeals = calendarMeals[dateKey] || {};
                const hasMeal =
                  dayMeals &&
                  Object.keys(dayMeals).length > 0 &&
                  Object.values(dayMeals).some(
                    meals => meals && Array.isArray(meals) && meals.length > 0
                  );
                const isTodayDate = isToday(dayData.date);

                return (
                  <CalendarDay
                    key={index}
                    className={`${!dayData.isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${hasMeal ? 'has-meal' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, dayData.date)}
                  >
                    <DayNumber>{dayData.day}</DayNumber>
                    {Object.entries(dayMeals).map(([mealType, meals]) =>
                      meals.map((meal, mealIndex) => (
                        <MealItem
                          key={`${mealType}-${mealIndex}`}
                          draggable
                          onDragStart={e =>
                            handleMealDragStart(e, meal, dateKey)
                          }
                        >
                          <div>
                            <MealIcon>{meal.icon}</MealIcon>
                            {meal.name}
                          </div>
                          <RemoveMealButton
                            onClick={() =>
                              removeMeal(dateKey, mealType, meal.name)
                            }
                          >
                            ×
                          </RemoveMealButton>
                        </MealItem>
                      ))
                    )}
                    {!hasMeal && dayData.isCurrentMonth && (
                      <DropZone className="drop-zone">
                        식사를 드래그하세요
                      </DropZone>
                    )}
                  </CalendarDay>
                );
              })}
            </CalendarGrid>
          </CalendarContainer>

          <SaveSection>
            <SaveButton
              onClick={handleSavePlan}
              disabled={
                !calendarMeals ||
                Object.keys(calendarMeals).length === 0 ||
                Object.values(calendarMeals).reduce((total, dayMeals) => {
                  if (!dayMeals) return total;
                  return (
                    total +
                    Object.values(dayMeals).reduce(
                      (dayTotal, meals) =>
                        dayTotal + (meals ? meals.length : 0),
                      0
                    )
                  );
                }, 0) === 0
              }
            >
              💾 식단 계획 저장하기
            </SaveButton>
          </SaveSection>
        </CalendarSection>
      </NutritionSection>
    </NutritionContainer>
  );
};

export default NutritionGuide;
