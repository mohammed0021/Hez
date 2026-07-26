import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaterState {
  dailyLog: Record<string, number>;
  goalMl: number;
  addWater: (date: string, ml: number) => void;
  setGoal: (ml: number) => void;
  getForDate: (date: string) => number;
  getWeekTotal: () => { date: string; ml: number }[];
  clear: () => void;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      dailyLog: {},
      goalMl: 3000,

      addWater: (date, ml) => {
        set((s) => ({
          dailyLog: { ...s.dailyLog, [date]: (s.dailyLog[date] || 0) + ml },
        }));
      },

      setGoal: (ml) => set({ goalMl: ml }),

      getForDate: (date) => get().dailyLog[date] || 0,

      getWeekTotal: () => {
        const result: { date: string; ml: number }[] = [];
        const d = new Date();
        d.setDate(d.getDate() - d.getDay());
        for (let i = 0; i < 7; i++) {
          const dateStr = d.toISOString().slice(0, 10);
          result.push({ date: dateStr, ml: get().dailyLog[dateStr] || 0 });
          d.setDate(d.getDate() + 1);
        }
        return result;
      },

      clear: () => set({ dailyLog: {} }),
    }),
    {
      name: 'hez-water-store',
      partialize: (s) => ({ dailyLog: s.dailyLog, goalMl: s.goalMl }),
    },
  ),
);
