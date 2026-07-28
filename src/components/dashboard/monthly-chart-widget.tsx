'use client';

import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { DashboardWidget } from './widget-shell';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export function MonthlyChartWidget() {
  const sessions = useWorkoutHistoryStore((s) => s.sessions);

  const today = new Date();
  const sixWeeksAgo = new Date(today);
  sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);

  const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const weekStart = new Date(sixWeeksAgo);
    weekStart.setDate(weekStart.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekSessions = sessions.filter((s) => {
      const d = new Date(s.completedAt);
      return d >= weekStart && d < weekEnd;
    });

    const totalVolume = weekSessions.reduce((sum, s) => sum + (s.volume || 0), 0);
    return {
      week: weekLabels[i] ?? '',
      volume: totalVolume,
    };
  });

  const last = monthlyData[monthlyData.length - 1];
  const total = last ? last.volume : 0;

  return (
    <DashboardWidget title="Volume Progress">
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-foreground text-2xl font-bold tracking-tight">
          {total.toLocaleString()}
        </span>
        <span className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
          kg this period
        </span>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <XAxis
              dataKey="week"
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
              formatter={(value) =>
                value == null ? ['-- kg', 'Volume'] : [`${value.toLocaleString()} kg`, 'Volume']
              }
            />
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#volumeGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}
