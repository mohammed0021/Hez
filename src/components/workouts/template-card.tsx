'use client';

import { Dumbbell, Clock, Trash2, Play, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Workout } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export function TemplateCard({ template, index }: { template: Workout; index: number }) {
  const t = useTranslations('workouts');
  const c = useTranslations('common');
  const loadTemplate = useWorkoutStore((s) => s.loadTemplate);
  const deleteTemplate = useWorkoutStore((s) => s.deleteTemplate);
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);

  const totalSets = template.blocks.reduce(
    (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0),
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-border/50 bg-card hover:border-primary/30 group rounded-2xl border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-sm font-semibold">{template.name}</h3>
          {template.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
              {template.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => {
              deleteTemplate(template.id);
            }}
            className="text-muted-foreground/40 hover:text-destructive flex size-7 items-center justify-center rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="text-muted-foreground/60 mt-3 flex items-center gap-3 text-[10px] font-medium tracking-wider uppercase">
        <span className="flex items-center gap-1">
          <Dumbbell size={11} /> {t('blocks_count', { count: template.blocks.length })}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {t('duration_min', { minutes: template.estimatedDuration })}
        </span>
        <span>{t('sets_count', { count: totalSets })}</span>
      </div>

      {template.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[8px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            loadTemplate(template.id);
            window.location.href = '/workouts/new';
          }}
          className="bg-muted text-foreground flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-medium"
        >
          <Play size={12} /> {t('use')}
        </button>
        <button
          onClick={() => {
            startWorkout(template);
            window.location.href = '/workouts/active';
          }}
          className="bg-primary text-primary-foreground flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-medium"
        >
          <Zap size={12} /> {c('start')}
        </button>
      </div>
    </motion.div>
  );
}
