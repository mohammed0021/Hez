'use client';

import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';

export function ProteinWidget() {
  const consumed = 86;
  const goal = 150;

  return (
    <DashboardWidget title="Protein Goal">
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-foreground">
            <AnimatedCounter value={consumed} suffix="g" decimals={0} />
          </span>
          <span className="text-xs text-muted-foreground">Goal: {goal}g</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((consumed / goal) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground/60">
          <span>Chicken breast</span>
          <span>+32g</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground/60">
          <span>Protein shake</span>
          <span>+25g</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground/60">
          <span>Greek yogurt</span>
          <span>+15g</span>
        </div>
      </div>
    </DashboardWidget>
  );
}
