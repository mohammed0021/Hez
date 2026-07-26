'use client';

import { create } from 'zustand';
import type {
  AdminStatsWithGrowth,
  UserAnalytics,
  WorkoutAnalytics,
  ProgressAnalytics,
  NutritionAnalytics,
  DeviceAnalytics,
  PwaAnalytics,
  PerformanceAnalytics,
} from '@/types/admin';

interface AnalyticsData {
  userAnalytics: UserAnalytics;
  workoutAnalytics: WorkoutAnalytics;
  progressAnalytics: ProgressAnalytics;
  nutritionAnalytics: NutritionAnalytics;
  deviceAnalytics: DeviceAnalytics;
  pwaAnalytics: PwaAnalytics;
  performanceAnalytics: PerformanceAnalytics;
}

interface AnalyticsState {
  data: AnalyticsData | null;
  stats: AdminStatsWithGrowth | null;
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  data: null,
  stats: null,
  isLoading: true,
  error: null,
  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/admin/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      set({ data, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/admin/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const stats = await res.json();
      set({ stats, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
