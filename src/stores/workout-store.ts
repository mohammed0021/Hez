import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Workout,
  WorkoutBlock,
  WorkoutExercise,
  WorkoutSet,
  SetType,
  BlockType,
} from '@/types/workout';

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function makeSet(sortOrder: number): WorkoutSet {
  return {
    id: uid(),
    type: 'normal',
    weightKg: 0,
    reps: 10,
    rpe: null,
    sortOrder,
    completed: false,
  };
}

function makeExercise(
  exerciseId: string,
  name: string,
  muscleGroups: string[],
  sortOrder: number,
): WorkoutExercise {
  return {
    id: uid(),
    exerciseId,
    exerciseName: name,
    muscleGroups,
    notes: '',
    restSeconds: 90,
    sortOrder,
    sets: [makeSet(0), makeSet(1), makeSet(2)],
  };
}

function makeBlock(type: BlockType, sortOrder: number): WorkoutBlock {
  return { id: uid(), type, restAfterBlock: 120, sortOrder, exercises: [] };
}

function makeWorkout(name: string): Workout {
  const block = makeBlock('standard', 0);
  return {
    id: uid(),
    name,
    description: '',
    notes: '',
    estimatedDuration: 45,
    blocks: [block],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isTemplate: false,
    tags: [],
  };
}

interface WorkoutState {
  currentWorkout: Workout | null;
  templates: Workout[];
  savedWorkouts: Workout[];
  isDirty: boolean;

  createNew: (name?: string) => void;
  loadWorkout: (id: string) => void;
  loadTemplate: (id: string) => void;
  setField: <K extends keyof Workout>(key: K, value: Workout[K]) => void;
  save: () => void;
  saveAsTemplate: () => void;
  deleteTemplate: (id: string) => void;
  deleteWorkout: (id: string) => void;
  duplicate: () => void;

  addBlock: (type?: BlockType) => void;
  removeBlock: (blockId: string) => void;
  setBlockType: (blockId: string, type: BlockType) => void;
  setBlockRest: (blockId: string, seconds: number) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;

  addExerciseToBlock: (
    blockId: string,
    exerciseId: string,
    name: string,
    muscleGroups: string[],
  ) => void;
  removeExercise: (exerciseId: string) => void;
  moveExercise: (blockId: string, fromIndex: number, toIndex: number) => void;
  setExerciseNotes: (exerciseId: string, notes: string) => void;
  setExerciseRest: (exerciseId: string, seconds: number) => void;

  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  setSetType: (exerciseId: string, setId: string, type: SetType) => void;

  getWorkoutById: (id: string) => Workout | undefined;
  getTemplateById: (id: string) => Workout | undefined;

  exportToJson: () => string;
  importFromJson: (json: string) => boolean;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      templates: [],
      savedWorkouts: [],
      isDirty: false,

      createNew: (name) =>
        set({ currentWorkout: makeWorkout(name || 'Untitled Workout'), isDirty: false }),

      loadWorkout: (id) => {
        const w = get().savedWorkouts.find((x) => x.id === id);
        if (w) set({ currentWorkout: JSON.parse(JSON.stringify(w)), isDirty: false });
      },

      loadTemplate: (id) => {
        const t = get().templates.find((x) => x.id === id);
        if (t) {
          const copy = JSON.parse(JSON.stringify(t));
          copy.id = uid();
          copy.isTemplate = false;
          copy.createdAt = new Date().toISOString();
          copy.updatedAt = new Date().toISOString();
          set({ currentWorkout: copy, isDirty: false });
        }
      },

      setField: (key, value) =>
        set((s) =>
          s.currentWorkout
            ? {
                currentWorkout: {
                  ...s.currentWorkout,
                  [key]: value,
                  updatedAt: new Date().toISOString(),
                },
                isDirty: true,
              }
            : {},
        ),

      save: () => {
        const w = get().currentWorkout;
        if (!w) return;
        const updated = { ...w, updatedAt: new Date().toISOString(), isTemplate: false };
        set((s) => {
          const existing = s.savedWorkouts.findIndex((x) => x.id === w.id);
          const savedWorkouts =
            existing >= 0
              ? s.savedWorkouts.map((x, i) => (i === existing ? updated : x))
              : [updated, ...s.savedWorkouts];
          return { savedWorkouts, currentWorkout: updated, isDirty: false };
        });
      },

      saveAsTemplate: () => {
        const w = get().currentWorkout;
        if (!w) return;
        const t = {
          ...JSON.parse(JSON.stringify(w)),
          id: uid(),
          isTemplate: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ templates: [...s.templates, t] }));
      },

      deleteTemplate: (id) => set((s) => ({ templates: s.templates.filter((x) => x.id !== id) })),

      deleteWorkout: (id) =>
        set((s) => ({ savedWorkouts: s.savedWorkouts.filter((x) => x.id !== id) })),

      duplicate: () => {
        const w = get().currentWorkout;
        if (!w) return;
        const copy = JSON.parse(JSON.stringify(w));
        copy.id = uid();
        copy.name = w.name + ' (Copy)';
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = new Date().toISOString();
        copy.isTemplate = false;
        set({ currentWorkout: copy, isDirty: true });
      },

      addBlock: (type = 'standard') =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const order = s.currentWorkout.blocks.length;
          const block = makeBlock(type, order);
          return {
            currentWorkout: { ...s.currentWorkout, blocks: [...s.currentWorkout.blocks, block] },
            isDirty: true,
          };
        }),

      removeBlock: (blockId) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks
            .filter((b) => b.id !== blockId)
            .map((b, i) => ({ ...b, sortOrder: i }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      setBlockType: (blockId, type) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) =>
            b.id === blockId ? { ...b, type } : b,
          );
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      setBlockRest: (blockId, seconds) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) =>
            b.id === blockId ? { ...b, restAfterBlock: seconds } : b,
          );
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      moveBlock: (fromIndex, toIndex) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = [...s.currentWorkout.blocks];
          const removed = blocks.splice(fromIndex, 1);
          if (removed[0] === undefined) return {};
          const [moved] = removed;
          blocks.splice(toIndex, 0, moved);
          return {
            currentWorkout: {
              ...s.currentWorkout,
              blocks: blocks.map((b, i) => ({ ...b, sortOrder: i })),
            },
            isDirty: true,
          };
        }),

      addExerciseToBlock: (blockId, exerciseId, name, muscleGroups) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const order = b.exercises.length;
            return {
              ...b,
              exercises: [...b.exercises, makeExercise(exerciseId, name, muscleGroups, order)],
            };
          });
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      removeExercise: (exerciseId) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => ({
            ...b,
            exercises: b.exercises
              .filter((e) => e.id !== exerciseId)
              .map((e, i) => ({ ...e, sortOrder: i })),
          }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      moveExercise: (blockId, fromIndex, toIndex) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => {
            if (b.id !== blockId) return b;
            const exercises = [...b.exercises];
            const removed = exercises.splice(fromIndex, 1);
            if (removed[0] === undefined) return b;
            const [moved] = removed;
            exercises.splice(toIndex, 0, moved);
            return { ...b, exercises: exercises.map((e, i) => ({ ...e, sortOrder: i })) };
          });
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      setExerciseNotes: (exerciseId, notes) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => ({
            ...b,
            exercises: b.exercises.map((e) => (e.id === exerciseId ? { ...e, notes } : e)),
          }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      setExerciseRest: (exerciseId, seconds) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => ({
            ...b,
            exercises: b.exercises.map((e) =>
              e.id === exerciseId ? { ...e, restSeconds: seconds } : e,
            ),
          }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      addSet: (exerciseId) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => ({
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              const order = e.sets.length;
              return { ...e, sets: [...e.sets, makeSet(order)] };
            }),
          }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      removeSet: (exerciseId, setId) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => ({
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              return {
                ...e,
                sets: e.sets
                  .filter((st) => st.id !== setId)
                  .map((st, i) => ({ ...st, sortOrder: i })),
              };
            }),
          }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      updateSet: (exerciseId, setId, updates) =>
        set((s) => {
          if (!s.currentWorkout) return {};
          const blocks = s.currentWorkout.blocks.map((b) => ({
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              return {
                ...e,
                sets: e.sets.map((st) => (st.id === setId ? { ...st, ...updates } : st)),
              };
            }),
          }));
          return { currentWorkout: { ...s.currentWorkout, blocks }, isDirty: true };
        }),

      setSetType: (exerciseId, setId, type) => {
        const store = get();
        store.updateSet(exerciseId, setId, { type });
      },

      getWorkoutById: (id) => get().savedWorkouts.find((w) => w.id === id),

      getTemplateById: (id) => get().templates.find((t) => t.id === id),

      exportToJson: () => {
        const w = get().currentWorkout;
        if (!w) return '{}';
        return JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), workout: w },
          null,
          2,
        );
      },

      importFromJson: (json) => {
        try {
          const data = JSON.parse(json);
          const w = data.workout || data;
          if (!w.name || !w.blocks) return false;
          w.id = uid();
          w.createdAt = new Date().toISOString();
          w.updatedAt = new Date().toISOString();
          w.isTemplate = false;
          set({ currentWorkout: w, isDirty: true });
          return true;
        } catch {
          return false;
        }
      },

      reset: () => set({ currentWorkout: null, isDirty: false }),
    }),
    {
      name: 'hez-workout-store',
      partialize: (state) => ({
        templates: state.templates,
        savedWorkouts: state.savedWorkouts,
      }),
    },
  ),
);
