'use client';

import { Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DashboardWidget } from './widget-shell';
import { AnimatedCounter } from './animated-counter';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export function StreakWidget() {
  const t = useTranslations('gamification');
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const streak = computeStreak(sessions);
  const best = computeBestStreak(sessions);

  const weekDays = 7;
  const filled = Math.min(streak, weekDays);

  return (
    <DashboardWidget>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10">
          <Flame size={20} className="text-orange-500" />
        </div>
        <div>
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            {t('current_streak')}
          </p>
          <p className="text-foreground text-2xl font-bold tracking-tight">
            <AnimatedCounter value={streak} suffix=" days" decimals={0} />
          </p>
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            {best > 0 ? `Personal best: ${best} days` : 'Complete a workout to start a streak'}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: weekDays }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < filled ? 'bg-orange-500' : 'bg-muted'}`}
          />
        ))}
      </div>
    </DashboardWidget>
  );
}

function computeStreak(sessions: { completedAt: string }[]): number {
  if (sessions.length === 0) return 0;
  const dates = Array.from(new Set(sessions.map((s) => s.completedAt.split('T')[0] ?? '')))
    .sort()
    .reverse();
  if (dates.length === 0 || !dates[0]) return 0;

  const todayStr = new Date().toISOString().split('T')[0] ?? '';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0] ?? '';

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i]!);
    const prev = new Date(dates[i - 1]!);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}

function computeBestStreak(sessions: { completedAt: string }[]): number {
  if (sessions.length === 0) return 0;
  const dates = Array.from(new Set(sessions.map((s) => s.completedAt.split('T')[0] ?? ''))).sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i]!);
    const prev = new Date(dates[i - 1]!);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (Math.round(diff) === 1) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}
