'use client';

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { DashboardWidget } from './widget-shell';

const data = [
  { day: 'Mon', minutes: 45, workouts: 1 },
  { day: 'Tue', minutes: 0, workouts: 0 },
  { day: 'Wed', minutes: 55, workouts: 1 },
  { day: 'Thu', minutes: 40, workouts: 1 },
  { day: 'Fri', minutes: 0, workouts: 0 },
  { day: 'Sat', minutes: 60, workouts: 1 },
  { day: 'Sun', minutes: 0, workouts: 0 },
];

export function WeeklyChartWidget() {
  const total = data.reduce((s, d) => s + d.workouts, 0);

  return (
    <DashboardWidget
      title="This Week"
      action={<span className="text-primary">{total} workouts</span>}
    >
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="minutes" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground/60">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </DashboardWidget>
  );
}
