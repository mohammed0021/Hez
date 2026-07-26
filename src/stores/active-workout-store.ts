import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workout, BlockType, SetType } from '@/types/workout';

export type WorkoutStatus = 'idle' | 'preparing' | 'active' | 'resting' | 'paused' | 'completed';

export interface ActiveSet {
  id: string;
  type: SetType;
  targetWeightKg: number;
  targetReps: number;
  actualWeightKg: number;
  actualReps: number;
  rpe: number | null;
  tempo: string;
  completed: boolean;
  completedAt: string | null;
}

export interface ActiveExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroups: string[];
  notes: string;
  restSeconds: number;
  sets: ActiveSet[];
  completed: boolean;
}

export interface ActiveBlock {
  id: string;
  type: BlockType;
  exercises: ActiveExercise[];
  completed: boolean;
}

export interface ActiveWorkoutData {
  id: string;
  name: string;
  notes: string;
  blocks: ActiveBlock[];
  status: WorkoutStatus;
  startedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  totalPausedMs: number;
  restTimerEnd: string | null;
  currentBlockIndex: number;
  currentExerciseIndex: number;
  currentSetIndex: number;
}

function convertWorkout(workout: Workout): ActiveWorkoutData {
  return {
    id: workout.id,
    name: workout.name,
    notes: workout.notes,
    blocks: workout.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      completed: false,
      exercises: b.exercises.map((e) => ({
        id: e.id,
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        muscleGroups: [...e.muscleGroups],
        notes: e.notes,
        restSeconds: e.restSeconds,
        completed: false,
        sets: e.sets.map((s) => ({
          id: s.id,
          type: s.type,
          targetWeightKg: s.weightKg,
          targetReps: s.reps,
          actualWeightKg: s.weightKg,
          actualReps: s.reps,
          rpe: s.rpe,
          tempo: '',
          completed: false,
          completedAt: null,
        })),
      })),
    })),
    status: 'idle',
    startedAt: null,
    pausedAt: null,
    completedAt: null,
    totalPausedMs: 0,
    restTimerEnd: null,
    currentBlockIndex: 0,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
  };
}

export function getCurrentExercise(data: ActiveWorkoutData): ActiveExercise | null {
  const block = data.blocks[data.currentBlockIndex];
  if (!block) return null;
  return block.exercises[data.currentExerciseIndex] ?? null;
}

export function getCurrentSet(data: ActiveWorkoutData): ActiveSet | null {
  const ex = getCurrentExercise(data);
  if (!ex) return null;
  return ex.sets[data.currentSetIndex] ?? null;
}

export function calculateVolume(data: ActiveWorkoutData): number {
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

export function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

// Auto-rest timer for supersets/giant sets: use exercise's restSeconds for individual exercises
// but when the last exercise in a superset block completes, use a longer rest
export function getRestDuration(data: ActiveWorkoutData): number {
  const block = data.blocks[data.currentBlockIndex];
  const ex = getCurrentExercise(data);
  if (!block || !ex) return 90;
  // If this is the last exercise in a superset block, use a default rest
  if (block.type !== 'standard' && data.currentExerciseIndex >= block.exercises.length - 1) {
    return 120;
  }
  return ex.restSeconds || 90;
}

interface ActiveWorkoutState {
  data: ActiveWorkoutData | null;

  startWorkout: (workout: Workout) => void;
  resumeWorkout: () => void;
  startSession: () => void;
  completeSet: (actualWeightKg: number, actualReps: number, rpe: number | null, tempo: string) => void;
  skipSet: () => void;
  goToNextSet: () => void;
  goToNextExercise: () => void;
  togglePause: () => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
  startRest: () => void;
  skipRest: () => void;
  tickRest: () => boolean; // returns true if timer expired
  updateSetField: (setIndex: number, field: 'actualWeightKg' | 'actualReps' | 'rpe' | 'tempo', value: number | string) => void;
  reset: () => void;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set, get) => ({
      data: null,

      startWorkout: (workout) => {
        const data = convertWorkout(workout);
        data.status = 'preparing';
        set({ data });
      },

      resumeWorkout: () => {
        const d = get().data;
        if (d && d.status === 'paused') {
          const pausedDuration = d.pausedAt ? Date.now() - new Date(d.pausedAt).getTime() : 0;
          set({ data: { ...d, status: 'active', pausedAt: null, totalPausedMs: d.totalPausedMs + pausedDuration } });
        }
      },

      startSession: () =>
        set((s) =>
          s.data ? { data: { ...s.data, status: 'active', startedAt: new Date().toISOString() } } : {},
        ),

      completeSet: (actualWeightKg, actualReps, rpe, tempo) =>
        set((s) => {
          if (!s.data) return {};
          const block = s.data.blocks[s.data.currentBlockIndex];
          if (!block) return {};
          const ex = block.exercises[s.data.currentExerciseIndex];
          if (!ex) return {};
          const set = ex.sets[s.data.currentSetIndex];
          if (!set) return {};
          const updatedSets = ex.sets.map((st, i) =>
            i === s.data!.currentSetIndex
              ? { ...st, actualWeightKg, actualReps, rpe, tempo, completed: true, completedAt: new Date().toISOString() }
              : st,
          );
          const updatedExercises = block.exercises.map((e, i) =>
            i === s.data!.currentExerciseIndex ? { ...e, sets: updatedSets } : e,
          );
          const updatedBlocks = s.data.blocks.map((b, i) =>
            i === s.data!.currentBlockIndex ? { ...b, exercises: updatedExercises } : b,
          );
          return { data: { ...s.data, blocks: updatedBlocks } };
        }),

      skipSet: () => {
        const d = get().data;
        if (!d) return;
        const block = d.blocks[d.currentBlockIndex];
        if (!block) return;
        const ex = block.exercises[d.currentExerciseIndex];
        if (!ex) return;
        const set = ex.sets[d.currentSetIndex];
        if (!set) return;

        // Mark as completed with 0 values
        get().completeSet(set.targetWeightKg, set.targetReps, null, '');
      },

      goToNextSet: () =>
        set((s) => {
          if (!s.data) return {};
          const block = s.data.blocks[s.data.currentBlockIndex];
          if (!block) return {};
          const ex = block.exercises[s.data.currentExerciseIndex];
          if (!ex) return {};

          if (s.data.currentSetIndex < ex.sets.length - 1) {
            return { data: { ...s.data, currentSetIndex: s.data.currentSetIndex + 1 } };
          }
          // All sets done in this exercise
          const updatedExercises = ex.sets.every((st) => st.completed)
            ? block.exercises.map((e, i) =>
                i === s.data!.currentExerciseIndex ? { ...e, completed: true } : e,
              )
            : block.exercises;

          const nextExerciseIndex = s.data.currentExerciseIndex + 1;
          if (nextExerciseIndex < block.exercises.length) {
            return {
              data: {
                ...s.data,
                blocks: s.data.blocks.map((b, i) =>
                  i === s.data!.currentBlockIndex ? { ...b, exercises: updatedExercises } : b,
                ),
                currentExerciseIndex: nextExerciseIndex,
                currentSetIndex: 0,
              },
            };
          }
          // All exercises done in this block
          const nextBlockIndex = s.data.currentBlockIndex + 1;
          if (nextBlockIndex < s.data.blocks.length) {
            return {
              data: {
                ...s.data,
                blocks: s.data.blocks.map((b, i) =>
                  i === s.data!.currentBlockIndex ? { ...b, completed: true, exercises: updatedExercises } : b,
                ),
                currentBlockIndex: nextBlockIndex,
                currentExerciseIndex: 0,
                currentSetIndex: 0,
              },
            };
          }
          // Workout complete
          return {
            data: {
              ...s.data,
              blocks: s.data.blocks.map((b, i) =>
                i === s.data!.currentBlockIndex ? { ...b, completed: true, exercises: updatedExercises } : b,
              ),
              status: 'completed',
              completedAt: new Date().toISOString(),
            },
          };
        }),

      goToNextExercise: () =>
        set((s) => {
          if (!s.data) return {};
          const nextEi = s.data.currentExerciseIndex + 1;
          const block = s.data.blocks[s.data.currentBlockIndex];
          if (!block) return {};
          if (nextEi < block.exercises.length) {
            return { data: { ...s.data, currentExerciseIndex: nextEi, currentSetIndex: 0 } };
          }
          return {};
        }),

      togglePause: () =>
        set((s) => {
          if (!s.data) return {};
          if (s.data.status === 'active' || s.data.status === 'resting') {
            return { data: { ...s.data, status: 'paused', pausedAt: new Date().toISOString(), restTimerEnd: null } };
          }
          if (s.data.status === 'paused') {
            const pausedMs = s.data.pausedAt ? Date.now() - new Date(s.data.pausedAt).getTime() : 0;
            return {
              data: { ...s.data, status: 'active', pausedAt: null, totalPausedMs: s.data.totalPausedMs + pausedMs },
            };
          }
          return {};
        }),

      completeWorkout: () =>
        set((s) =>
          s.data ? { data: { ...s.data, status: 'completed', completedAt: new Date().toISOString(), restTimerEnd: null } } : {},
        ),

      cancelWorkout: () => set({ data: null }),

      startRest: () =>
        set((s) => {
          if (!s.data) return {};
          const duration = getRestDuration(s.data);
          return { data: { ...s.data, status: 'resting', restTimerEnd: new Date(Date.now() + duration * 1000).toISOString() } };
        }),

      skipRest: () =>
        set((s) =>
          s.data ? { data: { ...s.data, status: 'active', restTimerEnd: null } } : {},
        ),

      tickRest: () => {
        const d = get().data;
        if (!d || !d.restTimerEnd) return false;
        const remaining = new Date(d.restTimerEnd).getTime() - Date.now();
        if (remaining <= 0) {
          set({ data: { ...d, status: 'active', restTimerEnd: null } });
          return true;
        }
        return false;
      },

      updateSetField: (setIndex, field, value) =>
        set((s) => {
          if (!s.data) return {};
          const block = s.data.blocks[s.data.currentBlockIndex];
          if (!block) return {};
          const ex = block.exercises[s.data.currentExerciseIndex];
          if (!ex) return {};
          const sets = ex.sets.map((st, i) => (i === setIndex ? { ...st, [field]: value } : st));
          const exercises = block.exercises.map((e, i) =>
            i === s.data!.currentExerciseIndex ? { ...e, sets } : e,
          );
          const blocks = s.data.blocks.map((b, i) =>
            i === s.data!.currentBlockIndex ? { ...b, exercises } : b,
          );
          return { data: { ...s.data, blocks } };
        }),

      reset: () => set({ data: null }),
    }),
    {
      name: 'hez-active-workout',
      partialize: (state) => ({ data: state.data }),
    },
  ),
);
