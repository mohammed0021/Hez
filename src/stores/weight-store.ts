import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number | null;
  notes: string;
}

interface WeightState {
  entries: WeightEntry[];
  addEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<WeightEntry>) => void;
  clear: () => void;
  syncFromServer: () => Promise<void>;
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: async (entry) => {
        const id = uid();
        set((s) => ({
          entries: [{ ...entry, id }, ...s.entries].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        }));
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data } = await supabase
              .from('weight_logs')
              .insert({
                user_id: user.id,
                weight_kg: entry.weightKg,
                body_fat_percent: entry.bodyFatPercent ?? null,
                notes: entry.notes || null,
                logged_at: new Date(entry.date).toISOString(),
              })
              .select('id')
              .single();
            if (data?.id) {
              set((s) => ({
                entries: s.entries.map((e) => (e.id === id ? { ...e, id: data.id } : e)),
              }));
            }
          }
        } catch (e) {
          console.error('Failed to sync weight entry to server:', e);
        }
      },

      deleteEntry: async (id) => {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
        try {
          const supabase = createClient();
          await supabase.from('weight_logs').delete().eq('id', id);
        } catch (e) {
          console.error('Failed to sync weight delete to server:', e);
        }
      },

      updateEntry: async (id, updates) => {
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
        try {
          const supabase = createClient();
          const payload: Record<string, unknown> = {};
          if ('weightKg' in updates) payload.weight_kg = updates.weightKg;
          if ('bodyFatPercent' in updates) payload.body_fat_percent = updates.bodyFatPercent;
          if ('notes' in updates) payload.notes = updates.notes;
          if ('date' in updates) payload.logged_at = new Date(updates.date!).toISOString();
          if (Object.keys(payload).length > 0) {
            await supabase.from('weight_logs').update(payload).eq('id', id);
          }
        } catch (e) {
          console.error('Failed to sync weight update to server:', e);
        }
      },

      clear: () => set({ entries: [] }),

      syncFromServer: async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const { data } = await supabase
            .from('weight_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('logged_at', { ascending: false });
          if (data && data.length > 0) {
            const entries: WeightEntry[] = data.map((log) => ({
              id: log.id,
              date: log.logged_at,
              weightKg: log.weight_kg,
              bodyFatPercent: log.body_fat_percent ?? null,
              notes: log.notes || '',
            }));
            set({ entries });
          }
        } catch (e) {
          console.error('Failed to sync weight from server:', e);
        }
      },
    }),
    { name: 'hez-weight-store', partialize: (s) => ({ entries: s.entries }) },
  ),
);
