'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export function WeeklyProgress() {
  const sessions = useWorkoutHistoryStore((s) => s.sessions);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weeklySessions = sessions.filter((s) => {
    const d = new Date(s.completedAt);
    return d >= weekStart && d <= today;
  });

  const totalVolume = weeklySessions.reduce((sum, s) => sum + (s.volume || 0), 0);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dayData = weekDays.map((_, i) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    const dayStr = day.toISOString().split('T')[0] ?? '';
    const daySessions = sessions.filter((s) => s.completedAt?.startsWith(dayStr ?? ''));
    return { count: daySessions.length };
  });

  return (
    <div className="border-border/50 bg-card rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground/60 flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase">
          <BarChart3 size={12} />
          Weekly Progress
        </p>
        {totalVolume > 0 && (
          <span className="text-muted-foreground text-[10px] font-medium">
            {(totalVolume / 1000).toFixed(1)}k kg
          </span>
        )}
      </div>

      <div className="mb-3 flex items-end gap-1.5">
        {dayData.map((d, i) => {
          const maxCount = Math.max(...dayData.map((x) => x.count), 1);
          const height = Math.max((d.count / maxCount) * 48, d.count > 0 ? 8 : 4);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-muted-foreground text-[10px] font-medium">{d.count}</span>
              <div
                className="bg-primary/30 w-full rounded-full transition-all"
                style={{ height }}
              />
              <span className="text-muted-foreground/60 text-[9px]">{weekDays[i]}</span>
            </div>
          );
        })}
      </div>

      <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
        <TrendingUp size={12} />
        <span>
          {weeklySessions.length} workout{weeklySessions.length !== 1 ? 's' : ''} this week
        </span>
      </div>
    </div>
  );
}
