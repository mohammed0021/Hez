'use client';

import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Scale } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { useWeightStore } from '@/stores/weight-store';

export function WeightWidget() {
  const entries = useWeightStore((s) => s.entries);
  const recent = entries.slice(0, 7).reverse();

  const latest = recent[recent.length - 1];

  if (entries.length === 0) {
    return (
      <DashboardWidget title="Weight Progress">
        <div className="mb-3 flex items-center gap-3">
          <Scale size={18} className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">No entries yet</span>
        </div>
        <p className="text-muted-foreground/60 text-[10px]">
          Log your weight in Progress to start tracking
        </p>
      </DashboardWidget>
    );
  }

  const first = recent[0];
  if (!latest || !first) return null;
  const change = latest.weightKg - first.weightKg;
  const isDown = change < 0;

  const chartData = recent.map((e) => ({
    day: new Date(e.date).toLocaleDateString(undefined, { weekday: 'short' }),
    kg: e.weightKg,
  }));

  return (
    <DashboardWidget
      title="Weight Progress"
      action={
        <span className={isDown ? 'text-green-500' : 'text-red-500'}>
          {isDown ? '▼' : '▲'} {Math.abs(change).toFixed(1)} kg
        </span>
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <Scale size={18} className="text-muted-foreground" />
        <span className="text-foreground text-2xl font-bold">{latest.weightKg.toFixed(1)}</span>
        <span className="text-muted-foreground text-xs">kg</span>
      </div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" hide />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="kg"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}
