'use client';

import { Calculator } from 'lucide-react';
import { useProfileStore } from '@/stores/profile-store';
import { useWeightStore } from '@/stores/weight-store';
import { useRouter } from 'next/navigation';

function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
  return { label: 'Obese', color: 'text-red-500' };
}

export function BMIDisplay() {
  const router = useRouter();
  const heightCm = useProfileStore((s) => s.heightCm);
  const profileWeightKg = useProfileStore((s) => s.weightKg);
  const weightEntries = useWeightStore((s) => s.entries);
  const latestWeight =
    weightEntries.length > 0 ? (weightEntries[0]?.weightKg ?? profileWeightKg) : profileWeightKg;

  const bmi = latestWeight && heightCm ? calculateBMI(latestWeight, heightCm) : 0;
  const category = getBMICategory(bmi);

  return (
    <div
      className="border-border/50 bg-card hover:bg-muted/50 cursor-pointer rounded-2xl border p-4 transition-colors"
      onClick={() => router.push('/progress/bmi')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-500/10">
            <Calculator size={20} className="text-teal-500" />
          </div>
          <div>
            <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
              BMI
            </p>
            <p className="text-foreground text-2xl font-bold tracking-tight">
              {bmi > 0 ? bmi.toFixed(1) : '—'}
            </p>
          </div>
        </div>
        {bmi > 0 && (
          <span className={`text-[10px] font-semibold ${category.color}`}>{category.label}</span>
        )}
      </div>
    </div>
  );
}
