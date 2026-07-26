'use client';

import { Dumbbell, Clock, Trash2, Play, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Workout } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

export function TemplateCard({ template, index }: { template: Workout; index: number }) {
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
      className="rounded-2xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{template.name}</h3>
          {template.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{template.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => {
              deleteTemplate(template.id);
            }}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground/60">
        <span className="flex items-center gap-1">
          <Dumbbell size={11} /> {template.blocks.length} blocks
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} /> ~{template.estimatedDuration} min
        </span>
        <span>{totalSets} sets</span>
      </div>

      {template.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[8px] font-medium text-muted-foreground"
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
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-muted py-2 text-[10px] font-medium text-foreground"
        >
          <Play size={12} /> Use
        </button>
        <button
          onClick={() => {
            startWorkout(template);
            window.location.href = '/workouts/active';
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-[10px] font-medium text-primary-foreground"
        >
          <Zap size={12} /> Start
        </button>
      </div>
    </motion.div>
  );
}
