'use client';

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { DashboardWidget } from './widget-shell';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export function WeeklyChartWidget() {
  const sessions = useWorkoutHistoryStore((s) => s.sessions);

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + i);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter((s) => s.completedAt.startsWith(dateStr ?? ''));
    const totalMin = daySessions.reduce((sum, s) => {
      const start = new Date(s.startedAt).getTime();
      const end = new Date(s.completedAt).getTime();
      return sum + Math.round((end - start) / 60000);
    }, 0);
    return {
      day: dayNames[i] ?? '',
      minutes: totalMin || 0,
      workouts: daySessions.length,
    };
  });

  const total = weekData.reduce((s, d) => s + d.workouts, 0);

  return (
    <DashboardWidget
      title="This Week"
      action={<span className="text-primary">{total} workouts</span>}
    >
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="minutes" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-muted-foreground/60 mt-2 flex justify-between text-[10px]">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
    </DashboardWidget>
  );
}
