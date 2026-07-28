'use client';

import { motion } from 'framer-motion';
import { Clock, Layers, Columns3, LayoutGrid, Pencil, Share2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Workout, BlockType } from '@/types/workout';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';
import { ShareDialog } from './share-dialog';

const blockIcons: Record<BlockType, typeof Layers> = {
  standard: Layers,
  superset: Columns3,
  giant_set: LayoutGrid,
};

const blockLabels: Record<BlockType, string> = {
  standard: 'Standard',
  superset: 'Superset',
  giant_set: 'Giant Set',
};

export function WorkoutDetail({ workout }: { workout: Workout }) {
  const [showShare, setShowShare] = useState(false);
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);

  const totalSets = workout.blocks.reduce(
    (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0),
    0,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-foreground text-2xl font-bold">{workout.name}</h1>
            {workout.description && (
              <p className="text-muted-foreground mt-1 text-sm">{workout.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Clock size={14} /> ~{workout.estimatedDuration} min
          </span>
          <span className="text-muted-foreground text-xs">{workout.blocks.length} blocks</span>
          <span className="text-muted-foreground text-xs">{totalSets} sets</span>
          {workout.tags.length > 0 && (
            <div className="flex gap-1">
              {workout.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[9px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              startWorkout(workout);
              window.location.href = '/workouts/active';
            }}
            className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
          >
            <Zap size={14} /> Start Workout
          </button>
          <Link
            href={`/workouts/${workout.id}/edit`}
            className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Pencil size={14} /> Edit
          </Link>
          <button
            onClick={() => setShowShare(true)}
            className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        {workout.blocks.map((block, bi) => {
          const Icon = blockIcons[block.type];
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: bi * 0.05 }}
              className="border-border/50 bg-card rounded-2xl border"
            >
              <div className="border-border/30 flex items-center gap-2 border-b px-4 py-3">
                <Icon size={14} className="text-primary" />
                <span className="text-foreground text-sm font-semibold">
                  {blockLabels[block.type]}
                </span>
                <span className="text-muted-foreground/60 ml-auto text-[10px]">
                  Rest:{' '}
                  {block.restAfterBlock >= 60
                    ? `${block.restAfterBlock / 60}m`
                    : `${block.restAfterBlock}s`}
                </span>
              </div>

              <div className="space-y-2 p-3">
                {block.exercises.map((ex, ei) => (
                  <div key={ex.id} className="bg-muted/30 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground/60 font-mono text-[10px]">
                        {ei + 1}
                      </span>
                      <span className="text-foreground flex-1 text-sm font-medium">
                        {ex.exerciseName}
                      </span>
                      <span className="text-muted-foreground/60 text-[10px]">
                        {ex.sets.length} sets × {ex.sets[0]?.reps || 0} reps
                        {ex.sets[0]?.weightKg ? ` @ ${ex.sets[0].weightKg}kg` : ''}
                      </span>
                    </div>

                    {ex.notes && (
                      <p className="text-muted-foreground/60 mt-1.5 pl-[1.625rem] text-[10px]">
                        {ex.notes}
                      </p>
                    )}

                    {/* Sets detail */}
                    <div className="mt-2 flex flex-wrap gap-1 pl-[1.625rem]">
                      {ex.sets.map((set) => (
                        <span
                          key={set.id}
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                            set.type === 'warmup'
                              ? 'bg-blue-500/10 text-blue-500'
                              : set.type === 'drop'
                                ? 'bg-purple-500/10 text-purple-500'
                                : set.type === 'failure'
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {set.type === 'normal'
                            ? ''
                            : set.type === 'warmup'
                              ? 'W'
                              : set.type === 'drop'
                                ? 'D'
                                : 'F'}
                          {set.weightKg > 0 ? `${set.weightKg}kg` : 'BW'} × {set.reps}
                          {set.rpe ? ` @${set.rpe}` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {workout.notes && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card rounded-2xl border p-4"
        >
          <h3 className="text-foreground mb-2 text-xs font-semibold">Notes</h3>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{workout.notes}</p>
        </motion.div>
      )}

      <ShareDialog open={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
