'use client';

import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';

export function ProteinWidget() {
  const today = new Date().toISOString().split('T')[0] ?? '';
  const log = useNutritionStore((s) => s.getLog(today));
  const consumed = log?.totalProtein ?? 0;
  const goal = useNutritionGoalsStore((s) => s.goals.protein);

  const topFoods =
    log?.meals
      .flatMap((m) => m.foods)
      .sort((a, b) => b.protein - a.protein)
      .slice(0, 3) ?? [];

  return (
    <DashboardWidget title="Protein Goal">
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="text-foreground text-2xl font-bold">
            <AnimatedCounter value={consumed} suffix="g" decimals={0} />
          </span>
          <span className="text-muted-foreground text-xs">Goal: {goal}g</span>
        </div>
        <div className="bg-muted h-2.5 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((consumed / goal) * 100, 100)}%` }}
          />
        </div>
        {topFoods.length > 0 ? (
          topFoods.map((f) => (
            <div
              key={f.foodId}
              className="text-muted-foreground/60 flex justify-between text-[10px]"
            >
              <span>{f.foodName}</span>
              <span>+{Math.round(f.protein * f.servings)}g</span>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground/40 flex justify-center pt-1 text-[10px]">
            Log meals to track protein
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}
