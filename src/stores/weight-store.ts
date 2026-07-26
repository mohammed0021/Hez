import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({
          entries: [...s.entries, { ...entry, id: uid() }].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        })),
      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      updateEntry: (id, updates) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: 'hez-weight-store', partialize: (s) => ({ entries: s.entries }) },
  ),
);
