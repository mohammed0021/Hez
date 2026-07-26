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
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{workout.name}</h1>
            {workout.description && (
              <p className="mt-1 text-sm text-muted-foreground">{workout.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={14} /> ~{workout.estimatedDuration} min
          </span>
          <span className="text-xs text-muted-foreground">{workout.blocks.length} blocks</span>
          <span className="text-xs text-muted-foreground">{totalSets} sets</span>
          {workout.tags.length > 0 && (
            <div className="flex gap-1">
              {workout.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
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
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            <Zap size={14} /> Start Workout
          </button>
          <Link
            href={`/workouts/${workout.id}/edit`}
            className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
          >
            <Pencil size={14} /> Edit
          </Link>
          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
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
              className="rounded-2xl border border-border/50 bg-card"
            >
              <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
                <Icon size={14} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">{blockLabels[block.type]}</span>
                <span className="text-[10px] text-muted-foreground/60 ml-auto">
                  Rest: {block.restAfterBlock >= 60 ? `${block.restAfterBlock / 60}m` : `${block.restAfterBlock}s`}
                </span>
              </div>

              <div className="p-3 space-y-2">
                {block.exercises.map((ex, ei) => (
                  <div key={ex.id} className="rounded-xl bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground/60 font-mono">{ei + 1}</span>
                      <span className="flex-1 text-sm font-medium text-foreground">{ex.exerciseName}</span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {ex.sets.length} sets × {ex.sets[0]?.reps || 0} reps{ex.sets[0]?.weightKg ? ` @ ${ex.sets[0].weightKg}kg` : ''}
                      </span>
                    </div>

                    {ex.notes && (
                      <p className="mt-1.5 text-[10px] text-muted-foreground/60 pl-[1.625rem]">{ex.notes}</p>
                    )}

                    {/* Sets detail */}
                    <div className="mt-2 flex flex-wrap gap-1 pl-[1.625rem]">
                      {ex.sets.map((set) => (
                        <span
                          key={set.id}
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                            set.type === 'warmup' ? 'bg-blue-500/10 text-blue-500' :
                            set.type === 'drop' ? 'bg-purple-500/10 text-purple-500' :
                            set.type === 'failure' ? 'bg-red-500/10 text-red-500' :
                            'bg-muted text-muted-foreground'
                          }`}
                        >
                          {set.type === 'normal' ? '' : set.type === 'warmup' ? 'W' : set.type === 'drop' ? 'D' : 'F'}
                          {set.weightKg > 0 ? `${set.weightKg}kg` : 'BW'} × {set.reps}{set.rpe ? ` @${set.rpe}` : ''}
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
          className="rounded-2xl border border-border/50 bg-card p-4"
        >
          <h3 className="mb-2 text-xs font-semibold text-foreground">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{workout.notes}</p>
        </motion.div>
      )}

      <ShareDialog open={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
