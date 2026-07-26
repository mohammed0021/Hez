import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FoodItem {
  id: string;
  name: string;
  servingSize: number;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
}

export interface MealFood {
  foodId: string;
  foodName: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface DailyLog {
  date: string;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface MealTemplate {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function recalcMeal(foods: MealFood[]): Pick<MealEntry, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat' | 'totalFiber'> {
  return {
    totalCalories: foods.reduce((s, f) => s + f.calories * f.servings, 0),
    totalProtein: foods.reduce((s, f) => s + f.protein * f.servings, 0),
    totalCarbs: foods.reduce((s, f) => s + f.carbs * f.servings, 0),
    totalFat: foods.reduce((s, f) => s + f.fat * f.servings, 0),
    totalFiber: foods.reduce((s, f) => s + f.fiber * f.servings, 0),
  };
}

function recalcDay(meals: MealEntry[]): Pick<DailyLog, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat' | 'totalFiber'> {
  return {
    totalCalories: meals.reduce((s, m) => s + m.totalCalories, 0),
    totalProtein: meals.reduce((s, m) => s + m.totalProtein, 0),
    totalCarbs: meals.reduce((s, m) => s + m.totalCarbs, 0),
    totalFat: meals.reduce((s, m) => s + m.totalFat, 0),
    totalFiber: meals.reduce((s, m) => s + m.totalFiber, 0),
  };
}

interface NutritionState {
  logs: DailyLog[];
  mealTemplates: MealTemplate[];
  addMeal: (date: string, mealType: MealEntry['mealType'], foods: MealFood[]) => void;
  removeMeal: (date: string, mealId: string) => void;
  getLog: (date: string) => DailyLog | undefined;
  saveAsTemplate: (name: string, mealType: MealEntry['mealType'], foods: MealFood[]) => void;
  deleteTemplate: (id: string) => void;
  clearLogs: () => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      logs: [],
      mealTemplates: [],

      addMeal: (date, mealType, foods) => {
        const totals = recalcMeal(foods);
        const meal: MealEntry = { id: uid(), date, mealType, foods, ...totals };
        set((s) => {
          const existingLog = s.logs.find((l) => l.date === date);
          let updatedLogs: DailyLog[];
          if (existingLog) {
            updatedLogs = s.logs.map((l) => {
              if (l.date !== date) return l;
              const meals = [...l.meals, meal];
              return { ...l, meals, ...recalcDay(meals) };
            });
          } else {
            const newLog: DailyLog = { date, meals: [meal], ...recalcDay([meal]) };
            updatedLogs = [...s.logs, newLog];
          }
          return { logs: updatedLogs };
        });
      },

      removeMeal: (date, mealId) => {
        set((s) => ({
          logs: s.logs.map((l) => {
            if (l.date !== date) return l;
            const meals = l.meals.filter((m) => m.id !== mealId);
            return { ...l, meals, ...recalcDay(meals) };
          }).filter((l) => l.meals.length > 0),
        }));
      },

      getLog: (date) => get().logs.find((l) => l.date === date),

      saveAsTemplate: (name, mealType, foods) => {
        const totals = recalcMeal(foods);
        const template: MealTemplate = { id: uid(), name, mealType, foods, ...totals };
        set((s) => ({ mealTemplates: [...s.mealTemplates, template] }));
      },

      deleteTemplate: (id) => set((s) => ({ mealTemplates: s.mealTemplates.filter((t) => t.id !== id) })),

      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'hez-nutrition-store',
      partialize: (s) => ({ logs: s.logs, mealTemplates: s.mealTemplates }),
    },
  ),
);
