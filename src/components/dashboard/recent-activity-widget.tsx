'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Trophy, Target } from 'lucide-react';
import { DashboardWidget } from './widget-shell';
import { useWorkoutHistoryStore } from '@/stores/workout-history-store';

function hoursAgo(timestamp: number) {
  return Math.round((Date.now() - timestamp) / 3600000);
}

export function RecentActivityWidget() {
  const sessions = useWorkoutHistoryStore((s) => s.sessions);
  const recent = sessions.slice(0, 4);

  if (recent.length === 0) {
    return (
      <DashboardWidget title="Recent Activity">
        <div className="text-muted-foreground flex flex-col items-center py-6">
          <Dumbbell size={24} className="mb-2 opacity-40" />
          <p className="text-xs">No activity yet</p>
          <p className="text-muted-foreground/60 mt-1 text-[10px]">
            Complete a workout to see activity here
          </p>
        </div>
      </DashboardWidget>
    );
  }

  const icons = [Dumbbell, Target, Trophy, Dumbbell];
  const colors = ['text-primary', 'text-green-500', 'text-orange-500', 'text-blue-500'];

  return (
    <DashboardWidget title="Recent Activity">
      <div className="space-y-3">
        {recent.map((s, i) => {
          const Icon = icons[i % icons.length] ?? Dumbbell;
          const color = colors[i % colors.length] ?? 'text-primary';
          const ha = hoursAgo(new Date(s.completedAt).getTime());
          const timeStr =
            ha < 1 ? 'Just now' : ha < 24 ? `${ha}h ago` : `${Math.round(ha / 24)}d ago`;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3"
            >
              <div
                className={`bg-muted flex size-8 items-center justify-center rounded-lg ${color}`}
              >
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">{s.name}</p>
                <p className="text-muted-foreground text-xs">
                  {s.volume.toLocaleString()} kg volume
                </p>
              </div>
              <span className="text-muted-foreground/60 shrink-0 text-[10px]">{timeStr}</span>
            </motion.div>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
