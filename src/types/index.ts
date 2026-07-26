export type * from './theme';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface Notification {
  id: string;
  title: string;
  body?: string;
  type: 'workout_reminder' | 'achievement_unlocked' | 'challenge' | 'progress' | 'system' | 'social';
  read: boolean;
  created_at: string;
  data?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon?: string;
  type: 'page' | 'exercise' | 'workout' | 'program' | 'recent';
}
