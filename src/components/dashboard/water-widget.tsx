'use client';

import { Plus } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';
import { useWaterStore } from '@/stores/water-store';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';

export function WaterWidget() {
  const today = new Date().toISOString().split('T')[0] ?? '';
  const consumed = useWaterStore((s) => s.getForDate(today) / 200);
  const addWater = useWaterStore((s) => s.addWater);
  const hydration = useNutritionGoalsStore((s) => s.hydration);
  const numberOfIntervals = Math.round(
    (hydration.endHour - hydration.startHour) / (hydration.intervalMinutes / 60),
  );
  const dailyWaterGoal = hydration.amountMl * numberOfIntervals;
  const goal = dailyWaterGoal / 200;

  const glasses = Array.from({ length: Math.max(Math.ceil(goal), 1) });

  return (
    <DashboardWidget title="Water Intake">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-10 overflow-hidden rounded-2xl border-2 border-blue-300 bg-blue-500/5">
            <div
              className="absolute right-0 bottom-0 left-0 bg-blue-500/30 transition-all duration-1000 ease-out"
              style={{ height: `${goal > 0 ? (consumed / goal) * 100 : 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
            </div>
          </div>
          <span className="text-muted-foreground mt-1 text-[10px]">
            {Math.round(consumed)}/{Math.round(goal)}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-foreground text-2xl font-bold tracking-tight">
            <AnimatedCounter value={consumed * 200} suffix=" ml" decimals={0} />
          </p>
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            of {goal * 200} ml goal
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {glasses.map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-all ${
                  i < consumed ? 'bg-blue-500 shadow-sm shadow-blue-500/30' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => addWater(today, 200)}
        className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500/10 py-2 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/20"
      >
        <Plus size={16} /> Log water
      </button>
    </DashboardWidget>
  );
}
