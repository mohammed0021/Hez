'use client';

import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Scale } from 'lucide-react';
import { DashboardWidget } from './widget-shell';

const data = [
  { day: 'Mon', kg: 78.5 },
  { day: 'Tue', kg: 78.2 },
  { day: 'Wed', kg: 78.8 },
  { day: 'Thu', kg: 78.1 },
  { day: 'Fri', kg: 77.8 },
  { day: 'Sat', kg: 77.5 },
  { day: 'Sun', kg: 77.2 },
];

export function WeightWidget() {
  const latest = data[data.length - 1] ?? data[0];
  const first = data[0];
  if (!latest || !first) return null;
  const change = latest.kg - first.kg;
  const isDown = change < 0;

  return (
    <DashboardWidget title="Weight Progress" action={<span className={isDown ? 'text-green-500' : 'text-red-500'}>{isDown ? '▼' : '▲'} {Math.abs(change).toFixed(1)} kg</span>}>
      <div className="flex items-center gap-3 mb-3">
        <Scale size={18} className="text-muted-foreground" />
        <span className="text-2xl font-bold text-foreground">{latest.kg.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">kg</span>
      </div>
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" hide />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line type="monotone" dataKey="kg" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}
