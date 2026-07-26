export interface AdminStats {
  totalUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalWorkouts: number;
  workoutsCompletedToday: number;
  totalExercisesLogged: number;
  totalProgramsCreated: number;
  averageWorkoutDuration: number;
  averageWeeklyWorkoutsPerUser: number;
  activeWorkoutStreaks: number;
  totalProgressPhotos: number;
  totalStorageUsed: number;
  totalPushSubscribers: number;
}

export interface AdminStatsWithGrowth extends AdminStats {
  userGrowth: number;
  dauGrowth: number;
  wauGrowth: number;
  mauGrowth: number;
  workoutGrowth: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  returningUsers: number;
  inactiveUsers: number;
  verifiedAccounts: number;
  guestAccounts: number;
  premiumUsers: number;
  accountCreationTimeline: { date: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byLanguage: { language: string; count: number }[];
  byGender: { gender: string; count: number }[];
  byAgeGroup: { group: string; count: number }[];
  byGoal: { goal: string; count: number }[];
  byExperience: { level: string; count: number }[];
}

export interface WorkoutAnalytics {
  mostPopularProgram: { name: string; count: number };
  mostPopularExercise: { name: string; count: number };
  mostTrainedMuscleGroup: { group: string; count: number };
  averageWorkoutDuration: number;
  averageSetsPerWorkout: number;
  averageTrainingVolume: number;
  personalRecordFrequency: number;
  workoutCompletionRate: number;
  weeklyReport: { week: string; workouts: number; duration: number }[];
  monthlyReport: { month: string; workouts: number; duration: number }[];
}

export interface ProgressAnalytics {
  averageWeightChange: number;
  averageBmiChange: number;
  averageStrengthIncrease: number;
  mostCommonGoals: { goal: string; count: number }[];
  goalCompletionRate: number;
  trendData: { date: string; weight: number; bmi: number; strength: number }[];
}

export interface NutritionAnalytics {
  averageDailyCalories: number;
  averageProteinIntake: number;
  averageWaterIntake: number;
  mostUsedSupplements: { name: string; count: number }[];
}

export interface DeviceAnalytics {
  byDevice: { device: string; count: number; percentage: number }[];
  byBrowser: { browser: string; count: number; percentage: number }[];
  byOS: { os: string; count: number; percentage: number }[];
}

export interface PwaAnalytics {
  totalInstalled: number;
  installPromptAcceptanceRate: number;
  pushPermissionRate: number;
  notificationOpenRate: number;
  offlineUsageCount: number;
  syncSuccessRate: number;
}

export interface PerformanceAnalytics {
  averagePageLoadTime: number;
  averageApiResponseTime: number;
  slowestPages: { path: string; loadTime: number }[];
  failedRequests: number;
  databasePerformance: { query: string; avgTime: number }[];
  storageUsed: number;
  errorRate: number;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  username: string;
  role: 'user' | 'premium' | 'admin';
  avatarUrl: string | null;
  goal: string | null;
  experienceLevel: string | null;
  onboardingCompleted: boolean;
  isVerified: boolean;
  lastSignInAt: string | null;
  createdAt: string;
  workoutsCount: number;
  totalVolume: number;
}

export interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'contact' | 'rating';
  status: 'new' | 'in_progress' | 'completed' | 'closed';
  title: string;
  description: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'blocked_request' | 'suspicious_activity' | 'admin_action';
  userId: string | null;
  email: string;
  ip: string;
  path: string;
  timestamp: string;
  details: string;
}

export interface SystemHealthStatus {
  database: 'healthy' | 'degraded' | 'down';
  authentication: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  realtime: 'healthy' | 'degraded' | 'down';
  notificationService: 'healthy' | 'degraded' | 'down';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface KpiCardData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}
