export type Gender = 'male' | 'female';
export type FitnessGoal =
  'lose_fat' | 'build_muscle' | 'maintain' | 'increase_strength' | 'improve_endurance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type UnitSystem = 'metric' | 'imperial';

export interface UserMetrics {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  workoutDaysPerWeek: number;
}

export interface CalculatedGoals {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  waterMl: number;
  idealWeightRange: { min: number; max: number };
  recommendedWorkoutDuration: number;
  recommendedRestDays: number;
}

const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight' },
  { max: 25, label: 'Normal' },
  { max: 30, label: 'Overweight' },
  { max: Infinity, label: 'Obese' },
] as const;

const TDEE_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const CALORIE_ADJUSTMENTS: Record<FitnessGoal, number> = {
  lose_fat: -500,
  build_muscle: 300,
  maintain: 0,
  increase_strength: 200,
  improve_endurance: 0,
};

const PROTEIN_MULTIPLIERS: Record<FitnessGoal, number> = {
  build_muscle: 2.2,
  lose_fat: 2.0,
  maintain: 1.8,
  increase_strength: 2.0,
  improve_endurance: 1.6,
};

const FAT_MULTIPLIERS: Partial<Record<FitnessGoal, number>> = {
  lose_fat: 0.8,
  build_muscle: 0.9,
};

const ACTIVITY_WATER_BONUS: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 200,
  moderate: 400,
  active: 600,
  very_active: 800,
};

const WORKOUT_DURATION: Record<ExperienceLevel, number> = {
  beginner: 35,
  intermediate: 50,
  advanced: 65,
};

const REST_DAYS: Record<FitnessGoal, number> = {
  build_muscle: 2,
  increase_strength: 2,
  lose_fat: 1,
  maintain: 1,
  improve_endurance: 1,
};

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): string {
  for (const cat of BMI_CATEGORIES) {
    if (bmi < cat.max) return cat.label;
  }
  return 'Obese';
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * TDEE_MULTIPLIERS[activityLevel];
}

export function calculateRecommendedCalories(tdee: number, goal: FitnessGoal): number {
  return tdee + CALORIE_ADJUSTMENTS[goal];
}

export function calculateProteinG(weightKg: number, goal: FitnessGoal, _gender: Gender): number {
  return PROTEIN_MULTIPLIERS[goal] * weightKg;
}

export function calculateFatG(weightKg: number, goal: FitnessGoal): number {
  const multiplier = FAT_MULTIPLIERS[goal] ?? 0.8;
  return multiplier * weightKg;
}

export function calculateCarbsG(weightKg: number, goal: FitnessGoal, tdee: number): number {
  const proteinCalories = calculateProteinG(weightKg, goal, 'male') * 4;
  const fatCalories = calculateFatG(weightKg, goal) * 9;
  const remainingCalories =
    calculateRecommendedCalories(tdee, goal) - proteinCalories - fatCalories;
  return Math.round(Math.max(0, remainingCalories / 4));
}

export function calculateFiberG(_age: number, gender: Gender): number {
  return gender === 'male' ? 38 : 25;
}

export function calculateWaterMl(
  weightKg: number,
  activityLevel: ActivityLevel,
  workoutDays: number,
): number {
  const base = weightKg * 33;
  const activityBonus = ACTIVITY_WATER_BONUS[activityLevel];
  const workoutBonus = workoutDays * 150;
  return Math.round(base + activityBonus + workoutBonus);
}

export function calculateIdealWeightRange(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

export function calculateRecommendedWorkoutDuration(experienceLevel: ExperienceLevel): number {
  return WORKOUT_DURATION[experienceLevel];
}

export function calculateRecommendedRestDays(fitnessGoal: FitnessGoal): number {
  return REST_DAYS[fitnessGoal];
}

export function calculateAllGoals(metrics: UserMetrics): CalculatedGoals {
  const bmi = calculateBMI(metrics.weightKg, metrics.heightCm);
  const bmr = calculateBMR(metrics.weightKg, metrics.heightCm, metrics.age, metrics.gender);
  const tdee = calculateTDEE(bmr, metrics.activityLevel);
  const recommendedCalories = calculateRecommendedCalories(tdee, metrics.fitnessGoal);
  const proteinG = calculateProteinG(metrics.weightKg, metrics.fitnessGoal, metrics.gender);
  const fatG = calculateFatG(metrics.weightKg, metrics.fitnessGoal);
  const carbsG = calculateCarbsG(metrics.weightKg, metrics.fitnessGoal, tdee);
  const fiberG = calculateFiberG(metrics.age, metrics.gender);
  const waterMl = calculateWaterMl(
    metrics.weightKg,
    metrics.activityLevel,
    metrics.workoutDaysPerWeek,
  );
  const idealWeightRange = calculateIdealWeightRange(metrics.heightCm);
  const recommendedWorkoutDuration = calculateRecommendedWorkoutDuration(metrics.experienceLevel);
  const recommendedRestDays = calculateRecommendedRestDays(metrics.fitnessGoal);

  return {
    bmi: Math.round(bmi * 100) / 100,
    bmiCategory: getBMICategory(bmi),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    recommendedCalories: Math.round(recommendedCalories),
    proteinG: Math.round(proteinG),
    carbsG,
    fatG: Math.round(fatG),
    fiberG,
    waterMl,
    idealWeightRange,
    recommendedWorkoutDuration,
    recommendedRestDays,
  };
}
