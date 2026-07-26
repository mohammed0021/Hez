import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface HydrationSettings {
  enabled: boolean;
  intervalMinutes: number;
  startHour: number;
  endHour: number;
  amountMl: number;
}

interface GoalsState {
  goals: MacroGoals;
  hydration: HydrationSettings;
  setGoals: (goals: MacroGoals) => void;
  setHydration: (settings: Partial<HydrationSettings>) => void;
}

export const useNutritionGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: {
        calories: 2200,
        protein: 150,
        carbs: 250,
        fat: 65,
        fiber: 30,
      },
      hydration: {
        enabled: true,
        intervalMinutes: 60,
        startHour: 7,
        endHour: 22,
        amountMl: 250,
      },

      setGoals: (goals) => set({ goals }),

      setHydration: (settings) =>
        set((s) => ({ hydration: { ...s.hydration, ...settings } })),
    }),
    {
      name: 'hez-nutrition-goals',
      partialize: (s) => ({ goals: s.goals, hydration: s.hydration }),
    },
  ),
);
