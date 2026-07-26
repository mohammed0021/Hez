import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';

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

function recalcMeal(
  foods: MealFood[],
): Pick<MealEntry, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat' | 'totalFiber'> {
  return {
    totalCalories: foods.reduce((s, f) => s + f.calories * f.servings, 0),
    totalProtein: foods.reduce((s, f) => s + f.protein * f.servings, 0),
    totalCarbs: foods.reduce((s, f) => s + f.carbs * f.servings, 0),
    totalFat: foods.reduce((s, f) => s + f.fat * f.servings, 0),
    totalFiber: foods.reduce((s, f) => s + f.fiber * f.servings, 0),
  };
}

function recalcDay(
  meals: MealEntry[],
): Pick<DailyLog, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat' | 'totalFiber'> {
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
  syncFromServer: () => Promise<void>;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      logs: [],
      mealTemplates: [],

      addMeal: async (date, mealType, foods) => {
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
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const inserts = foods.map((f) => ({
              user_id: user.id,
              logged_at: new Date(date).toISOString(),
              meal_type: mealType,
              food_name: f.foodName,
              portion_size: `${f.servings} serving(s)`,
              calories: Math.round(f.calories * f.servings),
              protein_g: f.protein * f.servings,
              carbs_g: f.carbs * f.servings,
              fat_g: f.fat * f.servings,
              fiber_g: f.fiber * f.servings,
            }));
            await supabase.from('nutrition_logs').insert(inserts);
          }
        } catch (e) {
          console.error('Failed to sync meal to server:', e);
        }
      },

      removeMeal: (date, mealId) => {
        set((s) => ({
          logs: s.logs
            .map((l) => {
              if (l.date !== date) return l;
              const meals = l.meals.filter((m) => m.id !== mealId);
              return { ...l, meals, ...recalcDay(meals) };
            })
            .filter((l) => l.meals.length > 0),
        }));
      },

      getLog: (date) => get().logs.find((l) => l.date === date),

      saveAsTemplate: (name, mealType, foods) => {
        const totals = recalcMeal(foods);
        const template: MealTemplate = { id: uid(), name, mealType, foods, ...totals };
        set((s) => ({ mealTemplates: [...s.mealTemplates, template] }));
      },

      deleteTemplate: (id) =>
        set((s) => ({ mealTemplates: s.mealTemplates.filter((t) => t.id !== id) })),

      clearLogs: () => set({ logs: [] }),

      syncFromServer: async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const { data } = await supabase
            .from('nutrition_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('logged_at', { ascending: false });
          if (!data || data.length === 0) return;
          const logMap = new Map<string, MealEntry[]>();
          for (const entry of data) {
            const day = entry.logged_at.slice(0, 10);
            const existing = logMap.get(day) || [];
            let meal = existing.find((m) => m.mealType === entry.meal_type);
            if (!meal) {
              meal = {
                id: uid(),
                date: day,
                mealType: entry.meal_type,
                foods: [],
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                totalFiber: 0,
              };
              existing.push(meal);
            }
            meal.foods.push({
              foodId: uid(),
              foodName: entry.food_name,
              servings: 1,
              calories: entry.calories || 0,
              protein: entry.protein_g || 0,
              carbs: entry.carbs_g || 0,
              fat: entry.fat_g || 0,
              fiber: entry.fiber_g || 0,
            });
            logMap.set(day, existing);
          }
          const logs: DailyLog[] = [];
          for (const [date, meals] of logMap) {
            const recalculated = meals.map((m) => ({ ...m, ...recalcMeal(m.foods) }));
            logs.push({ date, meals: recalculated, ...recalcDay(recalculated) });
          }
          logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          set({ logs });
        } catch (e) {
          console.error('Failed to sync nutrition from server:', e);
        }
      },
    }),
    {
      name: 'hez-nutrition-store',
      partialize: (s) => ({ logs: s.logs, mealTemplates: s.mealTemplates }),
    },
  ),
);
