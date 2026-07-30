'use client';

import { useRouter } from 'next/navigation';
import { Clock, ChevronRight } from 'lucide-react';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

export function RecentWorkouts() {
  const router = useRouter();
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const recent = sessions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="border-border/50 bg-card rounded-2xl border p-4">
        <p className="text-muted-foreground/60 mb-2 flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase">
          <Clock size={12} />
          Recent Workouts
        </p>
        <p className="text-muted-foreground text-sm">No workouts yet</p>
      </div>
    );
  }

  return (
    <div className="border-border/50 bg-card rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted-foreground/60 flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase">
          <Clock size={12} />
          Recent Workouts
        </p>
        <button
          onClick={() => router.push('/workouts')}
          className="text-primary hover:text-primary/80 text-[10px] font-medium transition-colors"
        >
          View all
        </button>
      </div>

      <div className="space-y-2">
        {recent.map((s, i) => {
          const date = new Date(s.completedAt);
          const dateStr = date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          return (
            <div
              key={s.id || i}
              className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
              onClick={() => router.push(`/workouts/${s.id}`)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {s.name || 'Workout'}
                </p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{dateStr}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
