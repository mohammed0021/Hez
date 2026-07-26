'use client';

import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { DashboardWidget } from './widget-shell';

const data = [
  { week: 'W1', volume: 3200 },
  { week: 'W2', volume: 4800 },
  { week: 'W3', volume: 5600 },
  { week: 'W4', volume: 7200 },
  { week: 'W5', volume: 6800 },
  { week: 'W6', volume: 8450 },
];

export function MonthlyChartWidget() {
  const last = data[data.length - 1];
  const total = last ? last.volume : 0;

  return (
    <DashboardWidget title="Volume Progress">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-foreground">{total.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">kg this month</span>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => value == null ? ['-- kg', 'Volume'] : [`${value.toLocaleString()} kg`, 'Volume']}
            />
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#volumeGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}
