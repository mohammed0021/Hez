import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';

interface WaterState {
  dailyLog: Record<string, number>;
  goalMl: number;
  addWater: (date: string, ml: number) => void;
  setGoal: (ml: number) => void;
  getForDate: (date: string) => number;
  getWeekTotal: () => { date: string; ml: number }[];
  clear: () => void;
  syncFromServer: () => Promise<void>;
}

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      dailyLog: {},
      goalMl: 3000,

      addWater: async (date, ml) => {
        set((s) => ({
          dailyLog: { ...s.dailyLog, [date]: (s.dailyLog[date] || 0) + ml },
        }));
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('water_logs').insert({
              user_id: user.id,
              amount_ml: ml,
              logged_at: new Date(date).toISOString(),
            });
          }
        } catch (e) {
          console.error('Failed to sync water to server:', e);
        }
      },

      setGoal: (ml) => {
        set({ goalMl: ml });
        try {
          const supabase = createClient();
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
              supabase.from('settings').update({ weekly_goal_water_ml: ml }).eq('user_id', user.id);
            }
          });
        } catch {}
      },

      getForDate: (date) => get().dailyLog[date] || 0,

      getWeekTotal: () => {
        const result: { date: string; ml: number }[] = [];
        const d = new Date();
        d.setDate(d.getDate() - d.getDay());
        for (let i = 0; i < 7; i++) {
          const dateStr = getDateKey(d);
          result.push({ date: dateStr, ml: get().dailyLog[dateStr] || 0 });
          d.setDate(d.getDate() + 1);
        }
        return result;
      },

      clear: () => set({ dailyLog: {} }),

      syncFromServer: async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const { data } = await supabase
            .from('water_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('logged_at', { ascending: true });
          if (data) {
            const log: Record<string, number> = {};
            for (const entry of data) {
              const day = getDateKey(new Date(entry.logged_at));
              log[day] = (log[day] || 0) + entry.amount_ml;
            }
            set({ dailyLog: log });
          }
        } catch (e) {
          console.error('Failed to sync water from server:', e);
        }
      },
    }),
    {
      name: 'hez-water-store',
      partialize: (s) => ({ dailyLog: s.dailyLog, goalMl: s.goalMl }),
    },
  ),
);
