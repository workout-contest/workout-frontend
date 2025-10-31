import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import storageManager from '../utils/storageManager';
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

const PlanSection = styled.div`
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
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

  &.has-workout {
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

const WorkoutItem = styled.div`
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

const WorkoutIcon = styled.span`
  margin-right: var(--spacing-xs);
`;

const RemoveWorkoutButton = styled.button`
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

const ExercisePalette = styled.div`
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

const ExerciseGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  height: calc(100% - 80px);
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

const ExerciseCard = styled.div`
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

const ExerciseIcon = styled.div`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
`;

const ExerciseName = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const ExerciseDetails = styled.div`
  font-family: var(--font-primary);
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.2;
  flex: 1;
`;

const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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

const SaveSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
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

const WorkoutPlan = () => {
  const [userInfo, setUserInfo] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarWorkouts, setCalendarWorkouts] = useState({});
  const [draggedExercise, setDraggedExercise] = useState(null);
  const [draggedWorkout, setDraggedWorkout] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [planData, setPlanData] = useState({
    exercises: [
      { name: '푸시업', icon: '💪', details: '3세트 x 10회' },
      { name: '스쿼트', icon: '🦵', details: '3세트 x 15회' },
      { name: '플랭크', icon: '🤸‍♀️', details: '3세트 x 30초' },
      { name: '런지', icon: '🏃‍♀️', details: '3세트 x 12회' },
      { name: '마운틴 클라이머', icon: '⛰️', details: '3세트 x 20회' },
      { name: '버피', icon: '⚡', details: '3세트 x 8회' },
      { name: '달리기', icon: '🏃‍♂️', details: '30분 러닝' },
      { name: '자전거', icon: '🚴‍♀️', details: '30분 사이클링' },
      { name: '수영', icon: '🏊‍♀️', details: '30분 수영' },
      { name: '요가', icon: '🧘‍♀️', details: '30분 요가' },
      { name: '필라테스', icon: '🤸‍♂️', details: '30분 필라테스' },
      { name: '스트레칭', icon: '🤸‍♀️', details: '15분 스트레칭' },
      { name: '웨이트 트레이닝', icon: '🏋️‍♀️', details: '45분 웨이트' },
      { name: '크로스핏', icon: '💥', details: '30분 크로스핏' },
      { name: '복싱', icon: '🥊', details: '30분 복싱' },
      { name: '줄넘기', icon: '🦘', details: '20분 줄넘기' },
      { name: '등산', icon: '🥾', details: '60분 등산' },
      { name: '축구', icon: '⚽', details: '60분 축구' },
      { name: '농구', icon: '🏀', details: '60분 농구' },
      { name: '테니스', icon: '🎾', details: '60분 테니스' },
    ],
  });

  useEffect(() => {
    const savedUserInfo = storageManager.getUserInfo();
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }

    // 운동계획 데이터 로드
    loadWorkoutPlanData();
  }, [currentDate]);

  // 운동계획 데이터 로드 함수
  const loadWorkoutPlanData = async () => {
    try {
      const userId = tokenManager.getUserId();
      if (!userId) {
        console.log('사용자 ID가 없습니다.');
        return;
      }

      setIsLoadingData(true);

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      console.log(`운동계획 조회: 사용자 ${userId}, ${year}년 ${month}월`);

      const response = await apiService.getWorkoutPlan(userId, year, month);

      if (response.data && Array.isArray(response.data)) {
        // API 응답 데이터를 달력 형식으로 변환
        const workoutData = {};

        response.data.forEach(workout => {
          if (workout.day && workout.workout_name) {
            const dateKey = formatDateKey(
              new Date(workout.year, workout.month - 1, workout.day)
            );

            // 같은 날짜에 여러 운동이 있을 수 있으므로 배열로 관리
            if (!workoutData[dateKey]) {
              workoutData[dateKey] = [];
            }

            workoutData[dateKey].push({
              name: workout.workout_name,
              icon: '💪', // 기본 아이콘
              details: 'API에서 로드됨',
            });
          }
        });

        setCalendarWorkouts(workoutData);
        console.log('운동계획 데이터 로드 완료:', workoutData);
      } else {
        console.log('운동계획 데이터가 없습니다.');
        setCalendarWorkouts({});
      }
    } catch (error) {
      console.error('운동계획 데이터 로드 오류:', error);
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
      const dayNumber = prevMonthDays - i;
      const prevMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        dayNumber
      );

      days.push({
        day: dayNumber,
        isCurrentMonth: false,
        date: prevMonthDate,
      });
    }

    // 현재 달의 날들
    for (let i = 1; i <= daysInMonth; i++) {
      const currentMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );

      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentMonthDate,
      });
    }

    // 다음 달의 첫 날들
    const remainingDays = 42 - days.length; // 6주 * 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      );

      days.push({
        day: i,
        isCurrentMonth: false,
        date: nextMonthDate,
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
  const handleExerciseDragStart = (e, exercise) => {
    setDraggedExercise(exercise);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleWorkoutDragStart = (e, workout, dateKey) => {
    setDraggedWorkout({ workout, dateKey });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();

    console.log('=== 드롭 이벤트 발생 ===');
    console.log('targetDate:', targetDate);
    console.log('currentDate:', currentDate);
    console.log('targetDate.getMonth():', targetDate.getMonth());
    console.log('currentDate.getMonth():', currentDate.getMonth());
    console.log('targetDate.getFullYear():', targetDate.getFullYear());
    console.log('currentDate.getFullYear():', currentDate.getFullYear());

    // 현재 달이 아닌 날짜에는 드롭하지 않음
    const isCurrentMonth =
      targetDate.getMonth() === currentDate.getMonth() &&
      targetDate.getFullYear() === currentDate.getFullYear();

    console.log('isCurrentMonth:', isCurrentMonth);

    if (!isCurrentMonth) {
      console.log('드롭 차단: 현재 달이 아닌 날짜', targetDate);
      return;
    }

    const dateKey = formatDateKey(targetDate);
    console.log('드롭 허용:', dateKey, targetDate);

    if (draggedExercise) {
      // 운동 팔레트에서 달력으로 드래그
      setCalendarWorkouts(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), draggedExercise],
      }));
      setDraggedExercise(null);
    } else if (draggedWorkout) {
      // 달력 내에서 운동 이동
      if (draggedWorkout.dateKey !== dateKey) {
        setCalendarWorkouts(prev => {
          const newWorkouts = { ...prev };
          // 원래 위치에서 제거
          newWorkouts[draggedWorkout.dateKey] = newWorkouts[
            draggedWorkout.dateKey
          ].filter(w => w.name !== draggedWorkout.workout.name);
          // 새 위치에 추가
          newWorkouts[dateKey] = [
            ...(newWorkouts[dateKey] || []),
            draggedWorkout.workout,
          ];
          return newWorkouts;
        });
      }
      setDraggedWorkout(null);
    }
  };

  const removeWorkout = (dateKey, workoutName) => {
    setCalendarWorkouts(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(w => w.name !== workoutName),
    }));
  };

  const handleSavePlan = async () => {
    const totalWorkouts = Object.values(calendarWorkouts).reduce(
      (total, workouts) => total + workouts.length,
      0
    );

    if (totalWorkouts === 0) {
      alert('최소 하나의 운동을 배치해주세요!');
      return;
    }

    try {
      // 사용자 ID 가져오기
      const userId = tokenManager.getUserId();
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      console.log('달력 운동 데이터:', calendarWorkouts);
      console.log('사용자 ID:', userId);
      console.log(
        '년월:',
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );

      // API 호출
      const response = await apiService.saveWorkoutPlan(
        parseInt(userId), // 사용자 ID를 숫자로 변환
        calendarWorkouts, // 달력의 모든 운동 데이터
        currentDate.getFullYear(), // 년도
        currentDate.getMonth() + 1 // 월
      );

      // 로컬 스토리지에도 저장 (기존 기능 유지)
      const planData = {
        workouts: calendarWorkouts,
        savedAt: new Date().toISOString(),
        totalWorkouts: totalWorkouts,
      };
      storageManager.saveWorkoutPlan(planData);

      alert(
        `🎉 운동 계획이 저장되었습니다!\n\n총 ${totalWorkouts}개의 운동이 배치되었습니다.\n매일 꾸준히 운동하시면 목표 달성에 한 걸음 더 가까워집니다! 💪`
      );

      // 저장 후 데이터 다시 로드
      loadWorkoutPlanData();
    } catch (error) {
      console.error('운동계획 저장 오류:', error);
      alert('운동계획 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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

  return (
    <PlanContainer>
      <Header>
        <Title>💪 운동 계획 수립</Title>
        <Subtitle>
          운동 팔레트에서 운동을 선택하여 달력의 원하는 날짜에 드래그 앤
          드롭으로 배치하고 저장하여 월별 운동 계획을 세워보세요
        </Subtitle>
      </Header>

      <PlanSection>
        <ExercisePalette>
          <PaletteTitle>🏋️‍♀️ 운동 팔레트</PaletteTitle>
          <ExerciseGrid>
            {planData.exercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                draggable
                onDragStart={e => handleExerciseDragStart(e, exercise)}
              >
                <ExerciseIcon>{exercise.icon}</ExerciseIcon>
                <ExerciseName>{exercise.name}</ExerciseName>
                <ExerciseDetails>{exercise.details}</ExerciseDetails>
              </ExerciseCard>
            ))}
          </ExerciseGrid>
        </ExercisePalette>

        <CalendarSection>
          <SectionTitle>📅 달력 운동 계획</SectionTitle>

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
                const dayWorkouts = calendarWorkouts[dateKey] || [];
                const hasWorkout = dayWorkouts.length > 0;
                const isTodayDate = isToday(dayData.date);

                return (
                  <CalendarDay
                    key={index}
                    className={`${!dayData.isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''}`}
                    onDragOver={
                      dayData.isCurrentMonth ? handleDragOver : undefined
                    }
                    onDrop={
                      dayData.isCurrentMonth
                        ? e => handleDrop(e, dayData.date)
                        : undefined
                    }
                  >
                    <DayNumber>{dayData.day}</DayNumber>
                    {dayWorkouts.map((workout, workoutIndex) => (
                      <WorkoutItem
                        key={workoutIndex}
                        draggable
                        onDragStart={e =>
                          handleWorkoutDragStart(e, workout, dateKey)
                        }
                      >
                        <div>
                          <WorkoutIcon>{workout.icon}</WorkoutIcon>
                          {workout.name}
                        </div>
                        <RemoveWorkoutButton
                          onClick={() => removeWorkout(dateKey, workout.name)}
                        >
                          ×
                        </RemoveWorkoutButton>
                      </WorkoutItem>
                    ))}
                    {dayWorkouts.length === 0 && dayData.isCurrentMonth && (
                      <DropZone className="drop-zone">
                        운동을 드래그하세요
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
                Object.values(calendarWorkouts).reduce(
                  (total, workouts) => total + workouts.length,
                  0
                ) === 0
              }
            >
              💾 운동 계획 저장하기
            </SaveButton>
          </SaveSection>
        </CalendarSection>
      </PlanSection>
    </PlanContainer>
  );
};

export default WorkoutPlan;
