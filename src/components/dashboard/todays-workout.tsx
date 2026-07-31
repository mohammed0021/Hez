'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DashboardWidget } from './widget-shell';
import { useWorkoutStore } from '@/stores/workout-store';

export function TodaysWorkout() {
  const t = useTranslations('dashboard');
  const tEx = useTranslations('exercises');
  const tCommon = useTranslations('common');
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const latest = savedWorkouts.length > 0 ? savedWorkouts[0] : null;

  if (!latest) {
    return (
      <DashboardWidget className="from-primary/10 to-primary/5 border-primary/20 bg-gradient-to-br">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
              {t('today_workout')}
            </p>
            <p className="text-foreground text-lg font-bold">{t('no_workout_today')}</p>
            <p className="text-muted-foreground text-xs">Create a workout to get started</p>
          </div>
        </div>
      </DashboardWidget>
    );
  }

  const exerciseCount = latest.blocks.reduce((s, b) => s + b.exercises.length, 0);
  const exerciseNames = latest.blocks
    .flatMap((b) => b.exercises)
    .slice(0, 6)
    .map((e) => e.exerciseName);

  return (
    <DashboardWidget className="from-primary/10 to-primary/5 border-primary/20 bg-gradient-to-br">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            {t('today_workout')}
          </p>
          <p className="text-foreground text-lg font-bold">{latest.name}</p>
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span>{tEx('showing_count', { count: exerciseCount })}</span>
            <span>•</span>
            <span>
              ~{latest.estimatedDuration} {tCommon('minute_short')}
            </span>
          </div>
        </div>
        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full shadow-lg">
          <Play size={20} className="ml-0.5" />
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        {exerciseNames.map((ex, i) => (
          <motion.div
            key={`${ex}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className="bg-background/60 text-foreground rounded-lg px-2 py-1 text-[10px] font-medium backdrop-blur-sm"
          >
            {ex}
          </motion.div>
        ))}
      </div>
    </DashboardWidget>
  );
}
