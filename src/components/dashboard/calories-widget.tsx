'use client';

import { CircularProgress } from './circular-progress';
import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';

export function CaloriesWidget() {
  const today = new Date().toISOString().split('T')[0] ?? '';
  const log = useNutritionStore((s) => s.getLog(today));
  const consumed = log?.totalCalories ?? 0;
  const macroGoals = useNutritionGoalsStore((s) => s.goals);
  const goal = macroGoals.calories || 2200;

  return (
    <DashboardWidget title="Calories">
      <div className="flex items-center gap-3">
        <CircularProgress value={consumed} max={goal} size={72} strokeWidth={5}>
          <span className="text-foreground text-lg font-semibold tracking-tight">
            {goal > 0 ? `${Math.round((consumed / goal) * 100)}%` : '0%'}
          </span>
        </CircularProgress>
        <div>
          <p className="text-foreground text-2xl font-bold tracking-tight">
            <AnimatedCounter value={consumed} decimals={0} />
          </p>
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            of {goal} kcal
          </p>
          <p className="text-muted-foreground/60 mt-1 text-[10px]">
            {goal > 0 ? `Remaining: ${Math.max(goal - consumed, 0)} kcal` : 'No daily goal set'}
          </p>
        </div>
      </div>
    </DashboardWidget>
  );
}
