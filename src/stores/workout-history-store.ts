import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActiveWorkoutData } from '@/stores/active-workout-store';

export interface ArchivedSession {
  id: string;
  name: string;
  startedAt: string;
  completedAt: string;
  totalPausedMs: number;
  volume: number;
  blocks: ActiveWorkoutData['blocks'];
}

interface WorkoutHistoryState {
  sessions: ArchivedSession[];
  addSession: (data: ActiveWorkoutData) => void;
  clearHistory: () => void;
}

export const useWorkoutHistoryStore = create<WorkoutHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (data) => {
        if (data.status !== 'completed') return;
        const session: ArchivedSession = {
          id: data.id,
          name: data.name,
          startedAt: data.startedAt || data.completedAt || new Date().toISOString(),
          completedAt: data.completedAt || new Date().toISOString(),
          totalPausedMs: data.totalPausedMs,
          volume: calculateArchivedVolume(data),
          blocks: data.blocks,
        };
        const existing = get().sessions.findIndex((s) => s.id === data.id);
        if (existing >= 0) return;
        set((s) => ({
          sessions: [...s.sessions, session].sort(
            (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
          ),
        }));
      },

      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: 'hez-workout-history',
      partialize: (state) => ({ sessions: state.sessions }),
    },
  ),
);

function calculateArchivedVolume(data: ActiveWorkoutData): number {
  let total = 0;
  for (const b of data.blocks) {
    for (const e of b.exercises) {
      for (const s of e.sets) {
        if (s.completed) total += s.actualWeightKg * s.actualReps;
      }
    }
  }
  return total;
}
