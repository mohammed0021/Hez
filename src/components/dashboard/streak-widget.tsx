'use client';

import { Flame } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';

export function StreakWidget() {
  return (
    <DashboardWidget>
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10">
          <Flame size={24} className="text-orange-500" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Current Streak</p>
          <p className="text-2xl font-bold text-foreground">
            <AnimatedCounter value={5} suffix=" days" decimals={0} />
          </p>
          <p className="text-xs text-muted-foreground">Personal best: 12 days</p>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < 5 ? 'bg-orange-500' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </DashboardWidget>
  );
}
