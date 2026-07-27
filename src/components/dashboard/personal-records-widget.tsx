'use client';

import { useMemo } from 'react';
import { ArrowRight, Trophy, Flame, BarChart3, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardWidget } from './widget-shell';
import { usePRStore } from '@/stores/pr-store';
import Link from 'next/link';

const recordIcons: Record<string, typeof Trophy> = {
  max_weight: Trophy,
  max_reps: Flame,
  max_volume: BarChart3,
  estimated_1rm: Zap,
};

export function PersonalRecordsWidget() {
  const getAllRecords = usePRStore((s) => s.getAllRecords);
  const records = useMemo(() => getAllRecords(), [getAllRecords]);
  const topRecords = records.slice(0, 3);

  return (
    <DashboardWidget title="Personal Records">
      {topRecords.length > 0 ? (
        <div className="space-y-3">
          {topRecords.map((r, i) => (
            <motion.div
              key={`${r.exerciseName}-${r.type}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-muted-foreground flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                {(() => {
                  const Icon = recordIcons[r.type] || Trophy;
                  return <Icon size={16} className="text-amber-500" />;
                })()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium">{r.exerciseName}</p>
                <p className="text-muted-foreground/60 text-[10px]">
                  {new Date(r.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-primary text-sm font-bold">
                {r.type === 'max_weight'
                  ? `${r.value} kg`
                  : r.type === 'max_reps'
                    ? `${r.value} reps`
                    : r.type === 'max_volume'
                      ? `${r.value.toLocaleString()} kg`
                      : r.type === 'estimated_1rm'
                        ? `${r.value} kg`
                        : `${r.value}`}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground flex flex-col items-center py-4">
          <Trophy size={24} className="mb-2 opacity-40" />
          <p className="text-xs">No records yet</p>
          <p className="text-muted-foreground/60 text-[10px]">Complete workouts to set PRs</p>
        </div>
      )}
      <Link
        href="/progress"
        className="bg-muted text-muted-foreground hover:bg-muted/80 mt-3 flex w-full items-center justify-center gap-1 rounded-xl py-2 text-xs transition-colors"
      >
        View all records <ArrowRight size={12} />
      </Link>
    </DashboardWidget>
  );
}
