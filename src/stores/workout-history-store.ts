import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase-client';
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
  syncFromServer: () => Promise<void>;
}

export const useWorkoutHistoryStore = create<WorkoutHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: async (data) => {
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
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const durationMin = Math.round(
              (new Date(session.completedAt).getTime() -
                new Date(session.startedAt).getTime() -
                session.totalPausedMs) /
                60000,
            );
            await supabase.from('workouts').insert({
              user_id: user.id,
              name: session.name,
              started_at: session.startedAt,
              completed_at: session.completedAt,
              duration_minutes: Math.max(durationMin, 1),
              source: 'manual',
            });
          }
        } catch (e) {
          console.error('Failed to sync workout to server:', e);
        }
      },

      clearHistory: () => set({ sessions: [] }),

      syncFromServer: async () => {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const { data } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (data && data.length > 0) {
            const sessions: ArchivedSession[] = data.map((w) => ({
              id: w.id,
              name: w.name,
              startedAt: w.started_at || w.created_at,
              completedAt: w.completed_at || w.created_at,
              totalPausedMs: 0,
              volume: 0,
              blocks: [],
            }));
            set((state) => {
              const merged = [...state.sessions];
              for (const serverSession of sessions) {
                const idx = merged.findIndex((s) => s.id === serverSession.id);
                if (idx === -1) {
                  merged.push(serverSession);
                }
              }
              return { sessions: merged };
            });
          }
        } catch (e) {
          console.error('Failed to sync workouts from server:', e);
        }
      },
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
