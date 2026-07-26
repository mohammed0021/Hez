export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';
export type BlockType = 'standard' | 'superset' | 'giant_set';

export interface WorkoutSet {
  id: string;
  type: SetType;
  weightKg: number;
  reps: number;
  rpe: number | null;
  sortOrder: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroups: string[];
  notes: string;
  restSeconds: number;
  sortOrder: number;
  sets: WorkoutSet[];
}

export interface WorkoutBlock {
  id: string;
  type: BlockType;
  restAfterBlock: number;
  sortOrder: number;
  exercises: WorkoutExercise[];
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  notes: string;
  estimatedDuration: number;
  blocks: WorkoutBlock[];
  createdAt: string;
  updatedAt: string;
  isTemplate: boolean;
  tags: string[];
}
