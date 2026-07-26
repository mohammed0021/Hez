import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWorkoutHistoryStore, type ArchivedSession } from './workout-history-store';

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  type: 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm';
  value: number;
  date: string;
  source: 'auto' | 'manual';
}

interface PRState {
  manualRecords: PersonalRecord[];
  addManualRecord: (record: Omit<PersonalRecord, 'id'>) => void;
  deleteRecord: (id: string) => void;
  clear: () => void;
}

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function computeEstimated1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

export function derivePRsFromHistory(sessions: ArchivedSession[]): PersonalRecord[] {
  const bestByExercise = new Map<string, { maxWeight: PersonalRecord; maxReps: PersonalRecord; maxVolume: PersonalRecord; est1rm: PersonalRecord }>();

  for (const session of sessions) {
    for (const block of session.blocks) {
      for (const ex of block.exercises) {
        if (ex.sets.length === 0) continue;

        let maxWeight = 0;
        let maxReps = 0;
        let maxVolume = 0;
        let bestEst1rm = 0;

        for (const s of ex.sets) {
          if (!s.completed) continue;
          const w = s.actualWeightKg || s.targetWeightKg;
          const r = s.actualReps || s.targetReps;
          const vol = w * r;
          if (w > maxWeight) maxWeight = w;
          if (r > maxReps) maxReps = r;
          if (vol > maxVolume) maxVolume = vol;
          const e1rm = computeEstimated1RM(w, r);
          if (e1rm > bestEst1rm) bestEst1rm = e1rm;
        }

        if (maxWeight === 0) continue;

        const existing = bestByExercise.get(ex.exerciseName) || {
          maxWeight: { id: '', exerciseName: ex.exerciseName, type: 'max_weight' as const, value: 0, date: '', source: 'auto' as const },
          maxReps: { id: '', exerciseName: ex.exerciseName, type: 'max_reps' as const, value: 0, date: '', source: 'auto' as const },
          maxVolume: { id: '', exerciseName: ex.exerciseName, type: 'max_volume' as const, value: 0, date: '', source: 'auto' as const },
          est1rm: { id: '', exerciseName: ex.exerciseName, type: 'estimated_1rm' as const, value: 0, date: '', source: 'auto' as const },
        };

        if (maxWeight > existing.maxWeight.value) {
          existing.maxWeight = { id: uid(), exerciseName: ex.exerciseName, type: 'max_weight', value: maxWeight, date: session.completedAt, source: 'auto' };
        }
        if (maxReps > existing.maxReps.value) {
          existing.maxReps = { id: uid(), exerciseName: ex.exerciseName, type: 'max_reps', value: maxReps, date: session.completedAt, source: 'auto' };
        }
        if (maxVolume > existing.maxVolume.value) {
          existing.maxVolume = { id: uid(), exerciseName: ex.exerciseName, type: 'max_volume', value: maxVolume, date: session.completedAt, source: 'auto' };
        }
        if (bestEst1rm > existing.est1rm.value) {
          existing.est1rm = { id: uid(), exerciseName: ex.exerciseName, type: 'estimated_1rm', value: bestEst1rm, date: session.completedAt, source: 'auto' };
        }

        bestByExercise.set(ex.exerciseName, existing);
      }
    }
  }

  const result: PersonalRecord[] = [];
  for (const { maxWeight, maxReps, maxVolume, est1rm } of bestByExercise.values()) {
    if (maxWeight.value > 0) result.push(maxWeight);
    if (maxReps.value > 0) result.push(maxReps);
    if (maxVolume.value > 0) result.push(maxVolume);
    if (est1rm.value > 0) result.push(est1rm);
  }

  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return result;
}

interface PRState {
  manualRecords: PersonalRecord[];
  addManualRecord: (record: Omit<PersonalRecord, 'id'>) => void;
  deleteRecord: (id: string) => void;
  clear: () => void;
  getAutoRecords: () => PersonalRecord[];
  getAllRecords: () => PersonalRecord[];
}

export const usePRStore = create<PRState>()(
  persist(
    (set, get) => ({
      manualRecords: [],

      addManualRecord: (record) =>
        set((s) => ({
          manualRecords: [...s.manualRecords, { ...record, id: uid() }],
        })),

      deleteRecord: (id) =>
        set((s) => ({
          manualRecords: s.manualRecords.filter((r) => r.id !== id),
        })),

      clear: () => set({ manualRecords: [] }),

      getAutoRecords: () => {
        const sessions = useWorkoutHistoryStore.getState().sessions;
        return derivePRsFromHistory(sessions);
      },

      getAllRecords: () => {
        const auto = get().getAutoRecords();
        return [...auto, ...get().manualRecords];
      },
    }),
    {
      name: 'hez-pr-store',
      partialize: (s) => ({ manualRecords: s.manualRecords }),
    },
  ),
);
