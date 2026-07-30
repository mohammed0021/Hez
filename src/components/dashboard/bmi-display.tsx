'use client';

import { useMemo } from 'react';
import { Calculator, TrendingDown, TrendingUp } from 'lucide-react';
import { useProfileStore } from '@/stores/profile-store';
import { useWeightStore } from '@/stores/weight-store';
import { useRouter } from 'next/navigation';
import {
  calculateBMI,
  getBMICategory,
  getIdealWeightRange,
  getHealthyWeightDifference,
} from '@/lib/bmi';

export function BMIDisplay() {
  const router = useRouter();
  const heightCm = useProfileStore((s) => s.heightCm);
  const profileWeightKg = useProfileStore((s) => s.weightKg);
  const weightEntries = useWeightStore((s) => s.entries);

  const latestWeight =
    weightEntries.length > 0 ? (weightEntries[0]?.weightKg ?? profileWeightKg) : profileWeightKg;
  const bmi = calculateBMI(latestWeight, heightCm);
  const category = getBMICategory(bmi);
  const idealRange = getIdealWeightRange(heightCm);
  const healthyDiff = getHealthyWeightDifference(latestWeight, idealRange);

  const weeklyChange = useMemo(() => {
    if (weightEntries.length < 2) return null;
    return (weightEntries[0]?.weightKg ?? 0) - (weightEntries[1]?.weightKg ?? 0);
  }, [weightEntries]);

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
            {bmi > 0 && (
              <p className={`text-[10px] font-medium ${category.color}`}>{category.label}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          {weeklyChange !== null && (
            <div className="flex items-center gap-1 text-[10px]">
              {weeklyChange > 0 ? (
                <TrendingUp size={12} className="text-red-500" />
              ) : weeklyChange < 0 ? (
                <TrendingDown size={12} className="text-green-500" />
              ) : null}
              <span
                className={
                  weeklyChange > 0
                    ? 'text-red-500'
                    : weeklyChange < 0
                      ? 'text-green-500'
                      : 'text-muted-foreground'
                }
              >
                {weeklyChange > 0 ? '+' : ''}
                {weeklyChange.toFixed(1)}kg
              </span>
            </div>
          )}
          {bmi > 0 && (
            <p
              className={`text-[10px] font-medium ${
                healthyDiff.direction === 'maintain' ? 'text-green-500' : 'text-muted-foreground'
              }`}
            >
              {healthyDiff.direction === 'maintain'
                ? 'Healthy range'
                : `${healthyDiff.diffKg.toFixed(1)}kg to goal`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
