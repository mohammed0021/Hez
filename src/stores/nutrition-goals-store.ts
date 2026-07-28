import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateAllGoals } from '@/lib/fitness-calculations';
import { useProfileStore } from './profile-store';

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
  autoCalculateFromProfile: () => void;
}

export const useNutritionGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
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

      setHydration: (settings) => set((s) => ({ hydration: { ...s.hydration, ...settings } })),

      autoCalculateFromProfile: () => {
        const profile = useProfileStore.getState();
        const age = profile.birthday
          ? Math.floor((Date.now() - new Date(profile.birthday).getTime()) / 31557600000)
          : 30;
        const metrics = {
          age,
          gender: profile.gender || 'male',
          heightCm: profile.heightCm || 175,
          weightKg: profile.weightKg || 75,
          activityLevel: profile.activityLevel || 'moderate',
          fitnessGoal: profile.primaryGoal,
          experienceLevel: profile.experienceLevel || 'intermediate',
          workoutDaysPerWeek: profile.weeklyWorkoutGoal || 4,
        };
        const calculated = calculateAllGoals(metrics);
        set({
          goals: {
            calories: calculated.recommendedCalories,
            protein: calculated.proteinG,
            carbs: calculated.carbsG,
            fat: calculated.fatG,
            fiber: calculated.fiberG,
          },
          hydration: {
            ...get().hydration,
            amountMl: Math.round(calculated.waterMl / (get().hydration.intervalMinutes || 60)),
          },
        });
      },
    }),
    {
      name: 'hez-nutrition-goals',
      partialize: (s) => ({ goals: s.goals, hydration: s.hydration }),
    },
  ),
);
