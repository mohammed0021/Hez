export const APP_NAME = 'Hêz';
export const APP_DESCRIPTION = 'Premium fitness tracking experience';
export const APP_VERSION = '1.0.0';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home', href: '/dashboard' },
  { id: 'workouts', label: 'Workouts', icon: 'Dumbbell', href: '/workouts' },
  { id: 'gamification', label: 'Rewards', icon: 'Sparkles', href: '/gamification' },
  { id: 'progress', label: 'Progress', icon: 'BarChart3', href: '/progress' },
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
] as const;

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'workouts', label: 'Workouts', icon: 'Dumbbell', href: '/workouts' },
  { id: 'exercises', label: 'Exercises', icon: 'BookOpen', href: '/exercises' },
  { id: 'programs', label: 'Programs', icon: 'NotebookText', href: '/programs' },
  { id: 'gamification', label: 'Gamification', icon: 'Sparkles', href: '/gamification' },
  { id: 'progress', label: 'Progress', icon: 'BarChart3', href: '/progress' },
  { id: 'nutrition', label: 'Nutrition', icon: 'Apple', href: '/nutrition' },
  { id: 'supplements', label: 'Supplements', icon: 'Pill', href: '/supplements' },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar', href: '/calendar' },
] as const;

export const SIDEBAR_BOTTOM_ITEMS = [
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
  { id: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' },
] as const;

export const THEME_STORAGE_KEY = 'hez-theme';

import type { SearchResult } from '@/types';

export const GAMIFICATION_NAV_ITEM = {
  id: 'gamification',
  label: 'Gamification',
  icon: 'Sparkles' as const,
  href: '/gamification',
} as const;

export const SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'go-dashboard',
    label: 'Dashboard',
    description: 'View your fitness overview',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    type: 'page',
  },
  {
    id: 'go-workouts',
    label: 'Workouts',
    description: 'Start or track a workout',
    href: '/workouts',
    icon: 'Dumbbell',
    type: 'page',
  },
  {
    id: 'go-exercises',
    label: 'Exercises',
    description: 'Browse exercise library',
    href: '/exercises',
    icon: 'BookOpen',
    type: 'page',
  },
  {
    id: 'go-programs',
    label: 'Programs',
    description: 'Browse workout programs',
    href: '/programs',
    icon: 'NotebookText',
    type: 'page',
  },
  {
    id: 'go-progress',
    label: 'Progress',
    description: 'Track your improvements',
    href: '/progress',
    icon: 'BarChart3',
    type: 'page',
  },
  {
    id: 'go-nutrition',
    label: 'Nutrition',
    description: 'Log your meals',
    href: '/nutrition',
    icon: 'Apple',
    type: 'page',
  },
  {
    id: 'go-supplements',
    label: 'Supplements',
    description: 'Track supplements',
    href: '/supplements',
    icon: 'Pill',
    type: 'page',
  },
  {
    id: 'go-gamification',
    label: 'Gamification',
    description: 'Achievements, challenges, and rewards',
    href: '/gamification',
    icon: 'Sparkles',
    type: 'page',
  },
  {
    id: 'go-calendar',
    label: 'Calendar',
    description: 'View your schedule',
    href: '/calendar',
    icon: 'Calendar',
    type: 'page',
  },
  {
    id: 'go-profile',
    label: 'Profile',
    description: 'Manage your profile',
    href: '/profile',
    icon: 'User',
    type: 'page',
  },
  {
    id: 'go-settings',
    label: 'Settings',
    description: 'App preferences',
    href: '/settings',
    icon: 'Settings',
    type: 'page',
  },
  {
    id: 'go-notifications',
    label: 'Notifications',
    description: 'Notification preferences',
    href: '/settings/notifications',
    icon: 'Bell',
    type: 'page',
  },
];

export const THEMES = [
  { id: 'hez-green', label: 'Green', color: '#10b981' },
  { id: 'hez-blue', label: 'Blue', color: '#3b82f6' },
  { id: 'hez-purple', label: 'Purple', color: '#8b5cf6' },
  { id: 'hez-red', label: 'Red', color: '#ef4444' },
  { id: 'hez-orange', label: 'Orange', color: '#f97316' },
  { id: 'hez-pink', label: 'Pink', color: '#ec4899' },
  { id: 'hez-teal', label: 'Teal', color: '#14b8a6' },
  { id: 'hez-rose', label: 'Rose', color: '#f43f5e' },
] as const;

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
] as const;
