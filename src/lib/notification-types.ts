export type NotificationTypeId =
  | 'workout_reminder'
  | 'pre_gym_reminder'
  | 'creatine_reminder'
  | 'water_reminder'
  | 'meal_reminder'
  | 'sleep_reminder'
  | 'rest_timer_alert'
  | 'workout_tomorrow_reminder'
  | 'weekly_summary'
  | 'monthly_summary'
  | 'achievement_unlocked';

export interface NotificationTypeConfig {
  id: NotificationTypeId;
  label: string;
  description: string;
  icon: string;
  hasTime: boolean;
  hasDays: boolean;
  hasAdvance: boolean;
  defaultEnabled: boolean;
  defaultTime?: string;
  defaultDays?: number[];
  defaultAdvanceMinutes?: number;
}

export const NOTIFICATION_TYPES: NotificationTypeConfig[] = [
  {
    id: 'workout_reminder',
    label: 'Workout Reminder',
    description: 'Daily reminder to complete your workout',
    icon: 'Dumbbell',
    hasTime: true,
    hasDays: true,
    hasAdvance: false,
    defaultEnabled: true,
    defaultTime: '07:00',
    defaultDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'pre_gym_reminder',
    label: 'Pre-Gym Reminder',
    description: 'Reminder before your scheduled gym session',
    icon: 'Clock',
    hasTime: true,
    hasDays: true,
    hasAdvance: true,
    defaultEnabled: true,
    defaultTime: '09:00',
    defaultDays: [1, 2, 3, 4, 5],
    defaultAdvanceMinutes: 30,
  },
  {
    id: 'creatine_reminder',
    label: 'Creatine Reminder',
    description: 'Daily reminder to take creatine',
    icon: 'Pill',
    hasTime: true,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
    defaultTime: '08:00',
  },
  {
    id: 'water_reminder',
    label: 'Water Reminder',
    description: 'Hydration reminder throughout the day',
    icon: 'Droplets',
    hasTime: false,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
  },
  {
    id: 'meal_reminder',
    label: 'Meal Reminder',
    description: 'Reminder to log your meals',
    icon: 'Apple',
    hasTime: true,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: false,
    defaultTime: '12:00',
  },
  {
    id: 'sleep_reminder',
    label: 'Sleep Reminder',
    description: 'Bedtime wind-down reminder',
    icon: 'Moon',
    hasTime: true,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
    defaultTime: '22:00',
  },
  {
    id: 'rest_timer_alert',
    label: 'Rest Timer Alert',
    description: 'Alert when rest timer expires during workout',
    icon: 'Timer',
    hasTime: false,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
  },
  {
    id: 'workout_tomorrow_reminder',
    label: 'Workout Tomorrow Reminder',
    description: 'Evening reminder about tomorrow\'s workout',
    icon: 'CalendarCheck',
    hasTime: true,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
    defaultTime: '20:00',
  },
  {
    id: 'weekly_summary',
    label: 'Weekly Summary',
    description: 'Weekly workout and progress summary',
    icon: 'BarChart3',
    hasTime: false,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
  },
  {
    id: 'monthly_summary',
    label: 'Monthly Summary',
    description: 'Monthly progress report',
    icon: 'LineChart',
    hasTime: false,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
  },
  {
    id: 'achievement_unlocked',
    label: 'Achievement Unlocked',
    description: 'Celebrate when you earn a new achievement',
    icon: 'Trophy',
    hasTime: false,
    hasDays: false,
    hasAdvance: false,
    defaultEnabled: true,
  },
];

export interface NotificationTypePrefs {
  enabled: boolean;
  time?: string;
  daysOfWeek?: number[];
  advanceMinutes?: number;
}

export interface QuietHours {
  enabled: boolean;
  start: string;
  end: string;
}

export interface NotificationStoreState {
  globalEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  permissionRequested: boolean;
  pushSubscription: PushSubscriptionJSON | null;
  quietHours: QuietHours;
  types: Record<NotificationTypeId, NotificationTypePrefs>;
}
