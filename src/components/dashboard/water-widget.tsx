'use client';

import { Plus } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';

const glasses = Array.from({ length: 10 });

export function WaterWidget() {
  const consumed = 6;
  const goal = 10;

  return (
    <DashboardWidget title="Water Intake">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-10 overflow-hidden rounded-2xl border-2 border-blue-300 bg-blue-500/5">
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-500/30 transition-all duration-1000 ease-out"
              style={{ height: `${(consumed / goal) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
            </div>
          </div>
          <span className="mt-1 text-[10px] text-muted-foreground">{consumed}/{goal}</span>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-foreground">
            <AnimatedCounter value={consumed * 200} suffix=" ml" decimals={0} />
          </p>
          <p className="text-xs text-muted-foreground">of {goal * 200} ml goal</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {glasses.map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-all ${
                  i < consumed
                    ? 'bg-blue-500 shadow-sm shadow-blue-500/30'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500/10 py-2 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/20">
        <Plus size={14} /> Log water
      </button>
    </DashboardWidget>
  );
}
