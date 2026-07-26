export type AchievementId = string;

export interface AchievementDef {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  hidden?: boolean;
}

export type ChallengeFrequency = 'daily' | 'weekly' | 'monthly';

export interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  xpReward: number;
  icon: string;
  target: number;
}

export function xpForLevel(level: number): number {
  return 50 * level * (level + 1);
}

export function getLevel(xp: number): {
  level: number;
  currentXp: number;
  nextXp: number;
  progress: number;
} {
  let level = 0;
  while (xpForLevel(level) <= xp) level++;
  const prev = level > 0 ? xpForLevel(level - 1) : 0;
  const next = xpForLevel(level);
  const progress = next > prev ? (xp - prev) / (next - prev) : 1;
  return { level, currentXp: xp - prev, nextXp: next - prev, progress };
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_workout',
    title: 'First Step',
    description: 'Complete your first workout',
    icon: 'Dumbbell',
    xpReward: 100,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Complete 7 workouts',
    icon: 'Flame',
    xpReward: 200,
  },
  {
    id: 'warrior',
    title: 'Warrior',
    description: 'Complete 30 workouts',
    icon: 'Swords',
    xpReward: 500,
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Complete 100 workouts',
    icon: 'Trophy',
    xpReward: 1000,
  },
  {
    id: 'volume_master',
    title: 'Volume Master',
    description: 'Accumulate 10,000kg total volume',
    icon: 'Weight',
    xpReward: 300,
  },
  {
    id: 'volume_legend',
    title: 'Volume Legend',
    description: 'Accumulate 100,000kg total volume',
    icon: 'Award',
    xpReward: 800,
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete 5 workouts in a week',
    icon: 'CalendarCheck',
    xpReward: 250,
  },
  {
    id: 'perfect_month',
    title: 'Perfect Month',
    description: 'Complete 20 workouts in a month',
    icon: 'Calendar',
    xpReward: 500,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a workout before 7 AM',
    icon: 'Sunrise',
    xpReward: 150,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a workout after 10 PM',
    icon: 'Moon',
    xpReward: 150,
  },
  { id: 'streak_3', title: 'On a Roll', description: '3 day streak', icon: 'Zap', xpReward: 100 },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: '7 day streak',
    icon: 'Flame',
    xpReward: 300,
  },
  {
    id: 'streak_30',
    title: 'Unstoppable',
    description: '30 day streak',
    icon: 'Award',
    xpReward: 800,
  },
  {
    id: 'streak_100',
    title: 'Century Club',
    description: '100 day streak',
    icon: 'Crown',
    xpReward: 2000,
  },
  {
    id: 'weight_tracker',
    title: 'Weight Tracker',
    description: 'Log weight 7 times',
    icon: 'Weight',
    xpReward: 100,
  },
  {
    id: 'measurement_pro',
    title: 'Measurement Pro',
    description: 'Log measurements 5 times',
    icon: 'Ruler',
    xpReward: 100,
  },
  {
    id: 'nutrition_logger',
    title: 'Nutrition Logger',
    description: 'Log 30 meals',
    icon: 'Apple',
    xpReward: 200,
  },
  {
    id: 'supplement_king',
    title: 'Supplement King',
    description: 'Log supplements 30 days',
    icon: 'Pill',
    xpReward: 200,
  },
  {
    id: 'pr_king',
    title: 'PR King',
    description: 'Achieve 10 personal records',
    icon: 'TrendingUp',
    xpReward: 400,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Complete workouts with 20 different exercises',
    icon: 'Compass',
    xpReward: 300,
  },
  {
    id: 'marathon',
    title: 'Marathon Session',
    description: 'Complete a workout over 2 hours',
    icon: 'Clock',
    xpReward: 200,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a workout under 20 minutes',
    icon: 'Zap',
    xpReward: 200,
  },
  {
    id: 'level_5',
    title: 'Getting Stronger',
    description: 'Reach level 5',
    icon: 'ArrowUp',
    xpReward: 200,
  },
  {
    id: 'level_10',
    title: 'Halfway There',
    description: 'Reach level 10',
    icon: 'ArrowUpCircle',
    xpReward: 500,
  },
  { id: 'level_20', title: 'Elite', description: 'Reach level 20', icon: 'Gem', xpReward: 1000 },
];

export const CHALLENGES: ChallengeDef[] = [
  {
    id: 'ch_daily_workout',
    title: 'Daily Workout',
    description: 'Complete 1 workout',
    frequency: 'daily',
    xpReward: 50,
    icon: 'Dumbbell',
    target: 1,
  },
  {
    id: 'ch_daily_sets',
    title: 'Set Master',
    description: 'Complete 10 sets',
    frequency: 'daily',
    xpReward: 30,
    icon: 'ListTodo',
    target: 10,
  },
  {
    id: 'ch_daily_volume',
    title: 'Volume Hunter',
    description: 'Accumulate 5,000kg volume',
    frequency: 'daily',
    xpReward: 40,
    icon: 'Weight',
    target: 5000,
  },
  {
    id: 'ch_daily_supplements',
    title: 'Supplement Check',
    description: 'Log all supplements',
    frequency: 'daily',
    xpReward: 20,
    icon: 'Pill',
    target: 1,
  },
  {
    id: 'ch_daily_water',
    title: 'Hydrated',
    description: 'Reach your water goal',
    frequency: 'daily',
    xpReward: 20,
    icon: 'Droplets',
    target: 1,
  },
  {
    id: 'ch_daily_meal',
    title: 'Fuel Up',
    description: 'Log at least 1 meal',
    frequency: 'daily',
    xpReward: 15,
    icon: 'Apple',
    target: 1,
  },
  {
    id: 'ch_daily_weight',
    title: 'Weigh In',
    description: 'Log your weight',
    frequency: 'daily',
    xpReward: 15,
    icon: 'Weight',
    target: 1,
  },
  {
    id: 'ch_weekly_workouts_3',
    title: 'Consistency',
    description: 'Complete 3 workouts this week',
    frequency: 'weekly',
    xpReward: 150,
    icon: 'CalendarCheck',
    target: 3,
  },
  {
    id: 'ch_weekly_workouts_5',
    title: 'Dedication',
    description: 'Complete 5 workouts this week',
    frequency: 'weekly',
    xpReward: 300,
    icon: 'Flame',
    target: 5,
  },
  {
    id: 'ch_weekly_volume',
    title: 'Weekly Volume',
    description: 'Accumulate 50,000kg volume this week',
    frequency: 'weekly',
    xpReward: 200,
    icon: 'TrendingUp',
    target: 50000,
  },
  {
    id: 'ch_weekly_days',
    title: 'Active Days',
    description: 'Work out on 5 different days this week',
    frequency: 'weekly',
    xpReward: 250,
    icon: 'CalendarDays',
    target: 5,
  },
  {
    id: 'ch_weekly_streak',
    title: 'Week Streak',
    description: 'Maintain a 7-day streak',
    frequency: 'weekly',
    xpReward: 200,
    icon: 'Zap',
    target: 7,
  },
  {
    id: 'ch_monthly_workouts',
    title: 'Monthly Warrior',
    description: 'Complete 15 workouts this month',
    frequency: 'monthly',
    xpReward: 500,
    icon: 'Trophy',
    target: 15,
  },
  {
    id: 'ch_monthly_volume',
    title: 'Monthly Volume',
    description: 'Accumulate 200,000kg volume this month',
    frequency: 'monthly',
    xpReward: 400,
    icon: 'Award',
    target: 200000,
  },
  {
    id: 'ch_monthly_sets',
    title: 'Set Collector',
    description: 'Complete 100 sets this month',
    frequency: 'monthly',
    xpReward: 350,
    icon: 'ListTodo',
    target: 100,
  },
  {
    id: 'ch_monthly_streak',
    title: 'Monthly Streak',
    description: 'Maintain a 14-day streak',
    frequency: 'monthly',
    xpReward: 600,
    icon: 'Flame',
    target: 14,
  },
  {
    id: 'ch_monthly_meals',
    title: 'Meal Logger',
    description: 'Log 30 meals this month',
    frequency: 'monthly',
    xpReward: 300,
    icon: 'Apple',
    target: 30,
  },
];

export const XP_REWARDS = {
  workout_complete: 50,
  workout_volume_per_100kg: 1,
  set_complete: 5,
  weight_log: 10,
  measurement_log: 15,
  meal_log: 5,
  supplement_log: 3,
  daily_login: 10,
  pr_achieved: 50,
} as const;
