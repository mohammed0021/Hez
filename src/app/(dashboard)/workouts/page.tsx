'use client';

import { Dumbbell, Plus, Clock, Bookmark, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWorkoutStore } from '@/stores/workout-store';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';
import { starterTemplates } from '@/data/workout-templates';

export default function WorkoutsPage() {
  const savedWorkouts = useWorkoutStore((s) => s.savedWorkouts);
  const userTemplates = useWorkoutStore((s) => s.templates);
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);
  const allTemplates = [...starterTemplates, ...userTemplates];

  const allWorkouts = [...savedWorkouts].reverse();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Workouts</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {allWorkouts.length} saved workouts
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/workouts/templates"
            className="bg-muted text-foreground hover:bg-muted/80 flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Bookmark size={14} /> Templates
          </Link>
          <Link
            href="/workouts/new"
            className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Plus size={14} /> New
          </Link>
        </div>
      </div>

      {/* Quick start from template */}
      {allTemplates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
          className="from-primary/10 to-primary/5 border-primary/20 mt-5 rounded-2xl border bg-gradient-to-br p-4"
        >
          <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
            Quick Start
          </p>
          <div className="flex scrollbar-none gap-2 overflow-x-auto pb-1">
            {allTemplates.slice(0, 5).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  startWorkout(t);
                  window.location.href = '/workouts/active';
                }}
                className="bg-card/80 border-border/50 hover:bg-card min-h-[44px] shrink-0 rounded-xl border px-4 py-3 text-left transition-colors"
              >
                <p className="text-foreground text-sm font-semibold whitespace-nowrap">{t.name}</p>
                <p className="text-muted-foreground/60 mt-0.5 text-[10px]">
                  ~{t.estimatedDuration} min
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Saved workouts */}
      <h2 className="text-foreground mt-7 mb-3 text-sm font-semibold">Saved Workouts</h2>
      <div className="space-y-2">
        {allWorkouts.length === 0 ? (
          <div className="border-border/50 bg-card flex flex-col items-center gap-3 rounded-2xl border p-4">
            <Dumbbell size={36} className="text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">No saved workouts yet</p>
            <Link
              href="/workouts/new"
              className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
            >
              <Plus size={14} /> Create your first workout
            </Link>
          </div>
        ) : (
          allWorkouts.map((w, i) => {
            const totalSets = w.blocks.reduce(
              (s, b) => s + b.exercises.reduce((se, e) => se + e.sets.length, 0),
              0,
            );
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/workouts/${w.id}`}
                  className="bg-card border-border/50 flex items-center gap-4 rounded-2xl border p-4"
                >
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                    <Dumbbell size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-semibold">{w.name}</p>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> ~{w.estimatedDuration} min
                      </span>
                      <span>{w.blocks.length} blocks</span>
                      <span>{totalSets} sets</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      startWorkout(w);
                      window.location.href = '/workouts/active';
                    }}
                    className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium"
                  >
                    <Zap size={12} /> Start
                  </button>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}
