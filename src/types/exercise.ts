export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'bodyweight' | 'olympic' | 'plyometric' | 'sports';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  muscleGroups: string[];
  equipment: string[];
  difficulty: Difficulty;
  instructions: string[];
  videoUrl: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  alternativeIds: string[];
  commonMistakes: string[];
  trainingTips: string[];
}

export interface ExerciseFilter {
  query: string;
  muscleGroups: string[];
  equipment: string[];
  difficulties: Difficulty[];
  category: ExerciseCategory | null;
}

export const MUSCLE_GROUPS = [
  'Chest',
  'Shoulders',
  'Back',
  'Biceps',
  'Triceps',
  'Forearms',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
  'Obliques',
  'Lower Back',
  'Traps',
  'Hip Flexors',
  'Adductors',
  'Abductors',
  'Full Body',
] as const;

export const EQUIPMENT_LIST = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Cable',
  'Machine',
  'Resistance Band',
  'Bodyweight',
  'EZ Bar',
  'Medicine Ball',
  'TRX',
  'Battle Ropes',
  'Jump Rope',
  'Foam Roller',
  'Pull-up Bar',
  'Bench',
  'Squat Rack',
  'Leg Press Machine',
  'Smith Machine',
  'Swiss Ball',
  'Box',
] as const;

export const MUSCLE_GROUP_MAP: Record<string, { label: string; region: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' }> = {
  Chest: { label: 'Chest', region: 'chest' },
  Shoulders: { label: 'Shoulders', region: 'shoulders' },
  Back: { label: 'Back', region: 'back' },
  Biceps: { label: 'Biceps', region: 'arms' },
  Triceps: { label: 'Triceps', region: 'arms' },
  Forearms: { label: 'Forearms', region: 'arms' },
  Quadriceps: { label: 'Quadriceps', region: 'legs' },
  Hamstrings: { label: 'Hamstrings', region: 'legs' },
  Glutes: { label: 'Glutes', region: 'legs' },
  Calves: { label: 'Calves', region: 'legs' },
  Core: { label: 'Core', region: 'core' },
  Obliques: { label: 'Obliques', region: 'core' },
  'Lower Back': { label: 'Lower Back', region: 'back' },
  Traps: { label: 'Traps', region: 'back' },
  'Hip Flexors': { label: 'Hip Flexors', region: 'legs' },
  Adductors: { label: 'Adductors', region: 'legs' },
  Abductors: { label: 'Abductors', region: 'legs' },
  'Full Body': { label: 'Full Body', region: 'core' },
};
