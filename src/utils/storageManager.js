// 로컬 스토리지 데이터 관리자
class LocalStorageManager {
  constructor() {
    this.keys = {
      USER_INFO: 'userInfo',
      WORKOUT_PLAN: 'workoutPlan',
      NUTRITION_PLAN: 'nutritionPlan',
      COMPLETED_WORKOUTS: 'completedWorkouts',
      COMPLETED_MEALS: 'completedMeals',
      ACHIEVEMENTS: 'achievements',
      COMMUNITY_POSTS: 'communityPosts',
      USER_PROGRESS: 'userProgress',
    };
  }

  // 사용자 정보 관리
  saveUserInfo(userInfo) {
    localStorage.setItem(this.keys.USER_INFO, JSON.stringify(userInfo));
    return userInfo;
  }

  getUserInfo() {
    const data = localStorage.getItem(this.keys.USER_INFO);
    return data ? JSON.parse(data) : null;
  }

  // 운동 계획 관리
  saveWorkoutPlan(workoutPlan) {
    localStorage.setItem(this.keys.WORKOUT_PLAN, JSON.stringify(workoutPlan));
    return workoutPlan;
  }

  getWorkoutPlan() {
    const data = localStorage.getItem(this.keys.WORKOUT_PLAN);
    return data ? JSON.parse(data) : null;
  }

  // 영양 계획 관리
  saveNutritionPlan(nutritionPlan) {
    localStorage.setItem(
      this.keys.NUTRITION_PLAN,
      JSON.stringify(nutritionPlan)
    );
    return nutritionPlan;
  }

  getNutritionPlan() {
    const data = localStorage.getItem(this.keys.NUTRITION_PLAN);
    return data ? JSON.parse(data) : null;
  }

  // 완료된 운동 관리
  saveCompletedWorkouts(completedWorkouts) {
    localStorage.setItem(
      this.keys.COMPLETED_WORKOUTS,
      JSON.stringify(completedWorkouts)
    );
    return completedWorkouts;
  }

  getCompletedWorkouts() {
    const data = localStorage.getItem(this.keys.COMPLETED_WORKOUTS);
    return data ? JSON.parse(data) : {};
  }

  addCompletedWorkout(dateKey, workoutName) {
    const completedWorkouts = this.getCompletedWorkouts();
    if (!completedWorkouts[dateKey]) {
      completedWorkouts[dateKey] = [];
    }
    if (!completedWorkouts[dateKey].includes(workoutName)) {
      completedWorkouts[dateKey].push(workoutName);
    }
    return this.saveCompletedWorkouts(completedWorkouts);
  }

  // 완료된 식사 관리
  saveCompletedMeals(completedMeals) {
    localStorage.setItem(
      this.keys.COMPLETED_MEALS,
      JSON.stringify(completedMeals)
    );
    return completedMeals;
  }

  getCompletedMeals() {
    const data = localStorage.getItem(this.keys.COMPLETED_MEALS);
    return data ? JSON.parse(data) : {};
  }

  addCompletedMeal(dateKey, mealType, mealName) {
    const completedMeals = this.getCompletedMeals();
    if (!completedMeals[dateKey]) {
      completedMeals[dateKey] = {};
    }
    if (!completedMeals[dateKey][mealType]) {
      completedMeals[dateKey][mealType] = [];
    }
    if (!completedMeals[dateKey][mealType].includes(mealName)) {
      completedMeals[dateKey][mealType].push(mealName);
    }
    return this.saveCompletedMeals(completedMeals);
  }

  // 성취 관리
  saveAchievements(achievements) {
    localStorage.setItem(this.keys.ACHIEVEMENTS, JSON.stringify(achievements));
    return achievements;
  }

  getAchievements() {
    const data = localStorage.getItem(this.keys.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  }

  // 커뮤니티 게시글 관리
  saveCommunityPosts(posts) {
    localStorage.setItem(this.keys.COMMUNITY_POSTS, JSON.stringify(posts));
    return posts;
  }

  getCommunityPosts() {
    const data = localStorage.getItem(this.keys.COMMUNITY_POSTS);
    return data ? JSON.parse(data) : [];
  }

  addCommunityPost(post) {
    const posts = this.getCommunityPosts();
    const newPost = {
      id: Date.now().toString(),
      ...post,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
    };
    posts.unshift(newPost);
    return this.saveCommunityPosts(posts);
  }

  // 사용자 진행상황 관리
  saveUserProgress(progress) {
    localStorage.setItem(this.keys.USER_PROGRESS, JSON.stringify(progress));
    return progress;
  }

  getUserProgress() {
    const data = localStorage.getItem(this.keys.USER_PROGRESS);
    return data
      ? JSON.parse(data)
      : {
          totalWorkouts: 0,
          totalCalories: 0,
          streakDays: 0,
          level: 1,
          points: 0,
        };
  }

  // 데이터 초기화
  clearAllData() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // 특정 데이터 삭제
  removeData(key) {
    localStorage.removeItem(key);
  }

  // 모든 데이터 가져오기 (디버깅용)
  getAllData() {
    const data = {};
    Object.entries(this.keys).forEach(([name, key]) => {
      data[name] = localStorage.getItem(key);
    });
    return data;
  }
}

// 싱글톤 인스턴스 생성
const storageManager = new LocalStorageManager();

export default storageManager;
