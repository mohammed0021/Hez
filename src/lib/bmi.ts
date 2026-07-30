export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export type BMICategory =
  | 'severely_underweight'
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese_class_1'
  | 'obese_class_2'
  | 'obese_class_3';

export function getBMICategory(bmi: number): { id: BMICategory; label: string; color: string } {
  if (bmi < 16)
    return { id: 'severely_underweight', label: 'Severely Underweight', color: 'text-blue-600' };
  if (bmi < 18.5) return { id: 'underweight', label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { id: 'normal', label: 'Normal', color: 'text-green-500' };
  if (bmi < 30) return { id: 'overweight', label: 'Overweight', color: 'text-yellow-500' };
  if (bmi < 35) return { id: 'obese_class_1', label: 'Obese Class I', color: 'text-orange-500' };
  if (bmi < 40) return { id: 'obese_class_2', label: 'Obese Class II', color: 'text-red-500' };
  return { id: 'obese_class_3', label: 'Obese Class III', color: 'text-red-700' };
}

export function getIdealWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  return {
    minKg: Math.round(18.5 * heightM * heightM * 10) / 10,
    maxKg: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

export function getHealthyWeightDifference(
  currentKg: number,
  idealRange: { minKg: number; maxKg: number },
): { diffKg: number; direction: 'lose' | 'gain' | 'maintain'; message: string } {
  if (currentKg > idealRange.maxKg) {
    const diff = currentKg - idealRange.maxKg;
    return {
      diffKg: Math.round(diff * 10) / 10,
      direction: 'lose',
      message: `Lose ${diff.toFixed(1)} kg to reach healthy range`,
    };
  }
  if (currentKg < idealRange.minKg) {
    const diff = idealRange.minKg - currentKg;
    return {
      diffKg: Math.round(diff * 10) / 10,
      direction: 'gain',
      message: `Gain ${diff.toFixed(1)} kg to reach healthy range`,
    };
  }
  return { diffKg: 0, direction: 'maintain', message: 'You are within a healthy weight range' };
}
