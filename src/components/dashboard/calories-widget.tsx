'use client';

import { CircularProgress } from './circular-progress';
import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';

export function CaloriesWidget() {
  const consumed = 1280;
  const goal = 2200;

  return (
    <DashboardWidget title="Calories">
      <div className="flex items-center gap-4">
        <CircularProgress value={consumed} max={goal} size={72} strokeWidth={5}>
          <span className="text-lg font-bold text-foreground">
            {Math.round((consumed / goal) * 100)}%
          </span>
        </CircularProgress>
        <div>
          <p className="text-2xl font-bold text-foreground">
            <AnimatedCounter value={consumed} decimals={0} />
          </p>
          <p className="text-xs text-muted-foreground">of {goal} kcal</p>
          <p className="mt-1 text-[10px] text-muted-foreground/60">Remaining: {goal - consumed} kcal</p>
        </div>
      </div>
    </DashboardWidget>
  );
}
